// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPerpetuals} from "./interfaces/IPerpetuals.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IChronicle} from "./interfaces/IChronicle.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract Perpetuals is Ownable, IPerpetuals {
    using SafeCast for uint256;
    using SafeCast for int256;
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    uint256 public maxLiquidityThreshold; // 4000 bps or 40%
    uint256 public maxLeveragePerPosition; // 2000 or 20x
    uint256 public liquidatorFee; // 500 or 5%
    uint256 public feeDistributionRate; // 1% a day or 100bps
    uint256 private nonce;

    // user => positionId => Position
    mapping(address => mapping(bytes32 => Position)) public positions;
    // user => token => StakedLiquidity
    mapping(address => mapping(address => StakedLiquidity)) public liquidityPerUser;
    // token => Liquidity
    mapping(address => Liquidity) public totalLiquidity;
    // token => fees
    mapping(address => uint256) public fees;
    // token => oracle
    mapping(address => address) public oracles;

    // tokens that can be used in perps
    EnumerableSet.AddressSet private allowedTokens;

    constructor(
        uint256 _maxLiquidityThreshold,
        uint256 _maxLeveragePerPosition,
        uint256 _liquidatorFee,
        uint256 _feeDistributionRate
    ) Ownable(msg.sender) {
        maxLiquidityThreshold = _maxLiquidityThreshold;
        maxLeveragePerPosition = _maxLeveragePerPosition;
        liquidatorFee = _liquidatorFee;
        feeDistributionRate = _feeDistributionRate;
    }

    function setLiquidatorFee(uint256 _liquidatorFee) external onlyOwner {
        require(_liquidatorFee <= 2500, "Liquidator fee too high");
        liquidatorFee = _liquidatorFee;
    }

    function setDistributionRate(uint256 _feeDistributionRate) external onlyOwner {
        require(_feeDistributionRate <= 500, "Fee distribution rate too high");
        feeDistributionRate = _feeDistributionRate;
    }

    function setAllowedTokens(address[] calldata _allowedTokens, address[] calldata _oracles) external onlyOwner {
        uint256 length = _allowedTokens.length;
        require(length != 0, "Array length can't be zero");
        require(_oracles.length == _allowedTokens.length, "Length mismatch");

        for (uint256 i; i < length; ++i) {
            address token = _allowedTokens[i];
            require(!allowedTokens.contains(token), "Token already added");
            require(_oracles[i] != address(0), "Invalid oracle");
            allowedTokens.add(token);
            oracles[token] = _oracles[i];
        }
    }

    function setMaxLiquidityThreshold(uint256 _maxLiquidityThreshold) external onlyOwner {
        require(_maxLiquidityThreshold <= 5000, "Liquidity threshold too high"); // max to define is 50%
        maxLiquidityThreshold = _maxLiquidityThreshold;
    }

    function setMaxLeveragePerPosition(uint256 _maxLeveragePerPosition) external onlyOwner {
        require(_maxLeveragePerPosition <= 2000, "Leverage too high"); // max to define is 20x
        maxLeveragePerPosition = _maxLeveragePerPosition;
    }

    function depositLiquidity(address _token, uint256 _liquidityAmount) external {
        require(_liquidityAmount != 0, "Can't deposited zero liquidity");
        require(allowedTokens.contains(_token), "Token not allowed");

        StakedLiquidity storage liquidityStakedByUser = liquidityPerUser[msg.sender][_token];
        liquidityStakedByUser.amount += _liquidityAmount;
        liquidityStakedByUser.lastStakedTimestamp = block.timestamp;
        liquidityStakedByUser.reward += _calculateStakingRewards(msg.sender, _token);

        // update total liquidity of the given token
        totalLiquidity[_token].total += _liquidityAmount;

        emit LiquidityDeposited(msg.sender, _token, _liquidityAmount);

        // transfer the liquidity from the user to the protocol
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _liquidityAmount);
    }

    function withdrawLiquidity(address _token, uint256 _liquidityAmount) external {
        require(_liquidityAmount != 0, "Can't deposited zero liquidity");
        require(allowedTokens.contains(_token), "Token not allowed");
        require(_liquidityAmount <= liquidityPerUser[msg.sender][_token].amount, "Not enough liquidity");

        // check if there's enough liquidity for the user to withdraw
        Liquidity memory liquidity = totalLiquidity[_token];
        uint256 liquidityAvailable = liquidity.total - liquidity.openInterest;
        require(_liquidityAmount <= liquidityAvailable, "Liquidity not available");

        // update the liquidity provided by the user for the given token
        liquidityPerUser[msg.sender][_token].amount -= _liquidityAmount;

        // update the timestamp that the user withdrew his liquidity
        liquidityPerUser[msg.sender][_token].lastStakedTimestamp = block.timestamp;

        // update total liquidity of the given token
        totalLiquidity[_token].total -= _liquidityAmount;

        emit LiquidityWithdrawed(msg.sender, _token, _liquidityAmount);

        // transfer the liquidity back to the user
        IERC20(_token).safeTransfer(msg.sender, _liquidityAmount);
    }

    function claimFees(address _token) external returns (uint256) {
        require(allowedTokens.contains(_token), "Token not allowed");
        require(liquidityPerUser[msg.sender][_token].amount != 0, "No liquidity deposited");

        // calculate the fees
        uint256 rewardFee = liquidityPerUser[msg.sender][_token].reward + _calculateStakingRewards(msg.sender, _token);
        require(rewardFee != 0, "No rewards to claim");

        liquidityPerUser[msg.sender][_token].reward = 0;
        liquidityPerUser[msg.sender][_token].lastStakedTimestamp = block.timestamp;

        // emit event of fees being claimed
        emit FeesClaimed(msg.sender, rewardFee);

        // pay the fees to the liquidity provider.
        IERC20(_token).safeTransfer(msg.sender, rewardFee);

        return rewardFee;
    }

    function openPosition(address _token, uint256 _size, uint256 _collateralAmount, PositionType _posType)
        external
        returns (bytes32)
    {
        require(allowedTokens.contains(_token), "Token not allowed");

        // check if the position is being created with a valid leverage
        Liquidity memory liquidity = totalLiquidity[_token];
        uint256 leverage = _calculateLeverage(_size, _collateralAmount);
        require(leverage <= maxLeveragePerPosition && leverage != 0, "Invalid leverage");

        require(_size != 0, "Size can't be zero");
        require(_collateralAmount != 0, "Collateral can't be zero");

        // create the user position
        uint256 tokenPrice = _getTokenPrice(_token);
        Position memory newPosition =
            Position(_token, block.timestamp, _size, _collateralAmount, tokenPrice, _posType, false);
        bytes32 id = keccak256(abi.encode(msg.sender, newPosition, block.chainid, nonce++));
        positions[msg.sender][id] = newPosition;

        // update the open interest of the token
        totalLiquidity[_token].openInterest += _size;

        // check if the open interest isn't bigger than the max ratio that can be used from the pool
        require(liquidity.openInterest < (liquidity.total * maxLiquidityThreshold) / 10_000, "Size too big"); // se o threshold for 1000 bps (10%) então tudo é 10_000(100%)

        emit PositionOpened(msg.sender, id, block.chainid);

        // transfer the collateral from the user to the protocol
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _collateralAmount);

        return id;
    }

    function closePosition(address _token, bytes32 _positionId) external {
        Position memory position = positions[msg.sender][_positionId];
        require(position.token == _token, "Invalid position");
        require(!position.closed, "Position already closed");

        positions[msg.sender][_positionId].closed = true;
        totalLiquidity[_token].openInterest -= position.size;
        int256 pnl = _calculatePnl(msg.sender, _positionId);

        emit PositionClosed(msg.sender, _positionId);

        if (pnl > 0) {
            IERC20(_token).safeTransfer(msg.sender, pnl.toUint256() + position.collateral);
        } else {
            uint256 maxPnl = pnl.toUint256() > position.collateral ? position.collateral : pnl.toUint256();
            uint256 remainingCollateral = position.collateral - maxPnl;

            fees[_token] += maxPnl;

            IERC20(_token).safeTransfer(msg.sender, remainingCollateral);
        }
    }

    function increaseCollateral(address _token, bytes32 _positionId, uint256 _collateralToDeposit) external {
        require(_collateralToDeposit != 0, "Collateral can't be zero");
        require(allowedTokens.contains(_token), "Token not allowed");

        // check if the position exists and is opened
        Position memory position = positions[msg.sender][_positionId];
        require(position.token != address(0), "Invalid position");
        require(!position.closed, "Position already closed");

        // calculate the new leverage and check if it is valid
        uint256 newCollateral = position.collateral + _collateralToDeposit;
        uint256 leverage = _calculateLeverage(position.size, newCollateral);
        require(leverage <= maxLeveragePerPosition && leverage != 0, "Invalid leverage");

        // update the collateral of the position
        positions[msg.sender][_positionId].collateral = newCollateral;

        emit CollateralIncreased(msg.sender, _positionId, _collateralToDeposit);

        // transfer the collateral from the user to the protocol
        IERC20(_token).safeTransferFrom(msg.sender, address(this), newCollateral);
    }

    function decreaseCollateral(address _token, bytes32 _positionId, uint256 _collateralToWithdraw) external {
        require(_collateralToWithdraw > 0, "Collateral can't be zero");
        require(allowedTokens.contains(_token), "Token not allowed");

        Position memory position = positions[msg.sender][_positionId];
        require(position.token != address(0), "Invalid position");
        require(!position.closed, "Position already closed");
        uint256 leverage = _calculateLeverage(position.size, (position.collateral - _collateralToWithdraw));
        require(leverage <= maxLeveragePerPosition, "Leverage too high");

        positions[msg.sender][_positionId].collateral -= _collateralToWithdraw;

        emit CollateralDecreased(msg.sender, _positionId, _collateralToWithdraw);

        IERC20(_token).safeTransfer(msg.sender, positions[msg.sender][_positionId].collateral);
    }

    function liquidate(address _trader, bytes32 _positionId) external {
        require(msg.sender != _trader, "Liquidator can't be the trader");
        Position storage position = positions[_trader][_positionId];
        require(position.token != address(0), "Invalid position");
        require(!position.closed, "Position already closed");
        uint256 leverage = _calculateLeverage(position.size, position.collateral);
        require(leverage > maxLeveragePerPosition, "Position isn't liquidatable");

        position.closed = true;
        totalLiquidity[position.token].openInterest -= position.size;
        uint256 liquidatorFeeAmount = (position.collateral * liquidatorFee) / 10_000;
        uint256 remainingFees = position.collateral - liquidatorFeeAmount;
        fees[position.token] += remainingFees;

        IERC20(position.token).transfer(msg.sender, liquidatorFeeAmount);

        emit UserLiquidated(_trader, _positionId, msg.sender);
    }

    function increaseSize(address _token, bytes32 _positionId, uint256 _sizeAmountToIncrease) external {
        require(allowedTokens.contains(_token), "Token not allowed");
        require(_sizeAmountToIncrease != 0, "Size to increase can't be zero");

        // check if the position exists and is opened
        Position memory position = positions[msg.sender][_positionId];
        require(position.token != address(0), "Invalid position");
        require(!position.closed, "Position already closed");

        // update the open interest of the token
        Liquidity memory liquidity = totalLiquidity[_token];
        liquidity.openInterest += _sizeAmountToIncrease;
        require(liquidity.openInterest < (liquidity.total * maxLiquidityThreshold) / 10_000, "Size too big");

        // update the leverage of the position
        uint256 newSize = position.size + _sizeAmountToIncrease;
        uint256 leverage = _calculateLeverage(newSize, position.collateral);
        require(leverage <= maxLeveragePerPosition && leverage != 0, "Invalid leverage");
        positions[msg.sender][_positionId].size = newSize;

        emit SizeIncreased(msg.sender, _positionId, newSize);
    }

    function decreaseSize(address _token, bytes32 _positionId, uint256 _sizeAmountToDecrease) external {
        require(allowedTokens.contains(_token), "Token not allowed");
        require(_sizeAmountToDecrease != 0, "Size to decrease can't be zero");

        // check if the position exists and is opened
        Position memory position = positions[msg.sender][_positionId];
        require(position.token != address(0), "Invalid position");
        require(!position.closed, "Position already closed");

        // calculate the delta realized pnl of the position
        int256 totalPositionPnl = _calculatePnl(msg.sender, _positionId);
        int256 realizedPnl = (totalPositionPnl * _sizeAmountToDecrease.toInt256()) / position.size.toInt256();

        // update the size based on the delta
        positions[msg.sender][_positionId].size -= _sizeAmountToDecrease;
        totalLiquidity[_token].openInterest -= _sizeAmountToDecrease;

        if (realizedPnl > 0) {
            // if the pnl if positive we need to pay the user his profits
            IERC20(_token).safeTransfer(msg.sender, realizedPnl.toUint256());
        } else {
            // if the pnl is negative it will be deducted from the user's collateral
            positions[msg.sender][_positionId].collateral -= realizedPnl.toUint256();
            fees[_token] += realizedPnl.toUint256();
        }

        emit SizeDecreased(msg.sender, _positionId, positions[msg.sender][_positionId].size, realizedPnl);
    }

    function _calculatePnl(address _user, bytes32 _positionId) internal view returns (int256) {
        Position memory position = positions[_user][_positionId];

        uint256 delta;
        if (position.posType == PositionType.LONG) {
            delta = _getTokenPrice(position.token) - position.price;
        } else {
            delta = position.price - _getTokenPrice(position.token);
        }

        uint256 pnlInDollars = delta * position.size;
        uint256 pnlInToken = pnlInDollars / _getTokenPrice(position.token);

        return pnlInToken.toInt256();
    }

    function _calculateLeverage(uint256 _size, uint256 _collateral) internal pure returns (uint256) {
        // calculate leverage with more precision to account for leverage under 1,
        // and to account for leverage with float points for ex: 2.50x
        // 20 ** 18 / 10 ** 18 == 2
        // ((20 ** 18) * 100) / 10 ** 18 = 200
        return (_size * 100) / _collateral;
    }

    function _getTokenPrice(address _token) internal view returns (uint256) {
        address oracle = oracles[_token];
        uint256 tokenPrice = IChronicle(oracle).read();
        return tokenPrice;
    }

    function _calculateStakingRewards(address _user, address _token) internal view returns (uint256) {
        StakedLiquidity storage liquidityStakedByUser = liquidityPerUser[_user][_token];
        uint256 stakingDuration = block.timestamp - liquidityStakedByUser.lastStakedTimestamp;
        return (liquidityStakedByUser.amount * feeDistributionRate * stakingDuration) / 10_000;
    }

    function isTokenValid(address _token) external view returns (bool) {
        return allowedTokens.contains(_token);
    }

    function getUserTokenLiquidity(address _user, address _token) external view returns (StakedLiquidity memory) {
        return liquidityPerUser[_user][_token];
    }

    function getTokenLiquidity(address _token) external view returns (Liquidity memory) {
        return totalLiquidity[_token];
    }

    function getUserPosition(address _user, bytes32 _id) external view returns (Position memory) {
        return positions[_user][_id];
    }
}

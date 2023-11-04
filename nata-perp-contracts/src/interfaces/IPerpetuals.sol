// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPerpetuals {
    enum PositionType {
        LONG, // 0
        SHORT // 1
    }

    struct Position {
        address token;
        uint256 timestamp;
        uint256 size;
        uint256 collateral;
        uint256 price;
        PositionType posType;
        bool closed;
    }

    struct Liquidity {
        uint256 total; // total liquidity deposited
        uint256 openInterest; // liquidity being used in positions
    }

    // events
    event LiquidityDeposited(address indexed user, address indexed token, uint256 amount);
    event LiquidityWithdrawed(address indexed user, address indexed token, uint256 amount);
    event PositionOpened(address indexed user, bytes32 indexed id);
    event PositionClosed(address indexed user, bytes32 indexed id);
    event CollateralIncreased(address indexed user, bytes32 indexed id, uint256 collateralIncreased);
    event CollateralDecreased(address indexed user, bytes32 indexed id, uint256 collateralDecreased);
    event SizeIncreased(address indexed user, bytes32 indexed id, uint256 sizeIncreased);
    event SizeDecreased(address indexed user, bytes32 indexed id, uint256 sizeDecreased, int256 realizedPnl);
    event FeesClaimed(address indexed user, uint256 feeWithdrawn);

    // governance functions
    function setAllowedTokens(address[] calldata _allowedTokens, address[] calldata _oracles) external;
    function setMaxLiquidityThreshold(uint256 _maxLiquidityThreshold) external;
    function setMaxLeveragePerPosition(uint256 _maxLeveragePerPosition) external;
    function setLiquidatorFee(uint256 _liquidatorFee) external;

    // liquidity providers functions
    function depositLiquidity(address _token, uint256 _liquidityAmount) external;
    function withdrawLiquidity(address _token, uint256 _liquidityAmount) external;
    function claimFees(address _token) external returns (uint256);

    // positions related functions
    function openPosition(address _token, uint256 _size, uint256 _collateralAmount, PositionType _posType)
        external
        returns (bytes32);
    function closePosition(address _token, bytes32 _positionId) external;
    function decreaseCollateral(address _token, bytes32 _positionId, uint256 _collateralToWithdraw) external;
    function increaseCollateral(address _token, bytes32 _positionId, uint256 _collateralToDeposit) external;
    function decreaseSize(address _token, bytes32 _positionId, uint256 _sizeAmountToIncrease) external;
    function increaseSize(address _token, bytes32 _positionId, uint256 _sizeAmountToDecrease) external;
    function liquidate(address _trader, bytes32 _positionId) external; // the liquidator fee will a % of the remaining collateral

    // getters
    function isTokenValid(address _token) external view returns (bool);
    function getUserTokenLiquidity(address _user, address _token) external view returns (uint256);
    function getTokenLiquidity(address _token) external view returns (Liquidity memory);
}

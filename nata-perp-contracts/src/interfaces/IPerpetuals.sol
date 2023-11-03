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
        uint256 averagePrice;
        PositionType posType;
        bool closed;
    }

    // the liquidity available can be calculated by total liquidity - open interest
    struct Liquidity {
        uint256 total; // total liquidity deposited (includes reserved and available liquidity)
        uint256 openInterest; // liquidity being used in positions aka. open interest
    }

    event LiquidityDeposited(address indexed user, address indexed token, uint256 amount);
    event LiquidityWithdrawed(address indexed user, address indexed token, uint256 amount);
    event PositionOpened(address indexed user, bytes32 indexed id);
    event CollateralIncreased(address indexed user, bytes32 indexed id, uint256 newCollateral);
    event SizeIncreased(address indexed user, bytes32 indexed id, uint256 newSize);

    // governance functions
    function setAllowedTokens(address[] calldata _allowedTokens) external;                                                      
    function setMaxLiquidityThreshold(uint256 _maxLiquidityThreshold) external;                                                 
    function setMaxLeveragePerPosition(uint256 _maxLeveragePerPosition) external;                                               

    // liquidity providers functions
    function depositLiquidity(address _token, uint256 _liquidityAmount) external;                                               
    function withdrawLiquidity(address _token, uint256 _liquidityAmount) external;                                              

    // positions related functions
    function openPosition(
        address _token,
        uint256 _size,
        uint256 _collateralAmount,
        PositionType _posType                                                                                                   
    ) external returns (bytes32);
    // function closePosition(address _token, bytes32 _positionId) external;
    // function decreaseCollateral(address _token, bytes32 _positionId, uint256 _collateralToWithdraw) external; 
    function increaseCollateral(address _token, bytes32 _positionId, uint256 _collateralToDeposit) external;
    // function decreaseSize(address _token, bytes32 _positionId, uint256 _sizeAmountToIncrease) external; 
    function increaseSize(address _token, bytes32 _positionId, uint256 _sizeAmountToDecrease) external;                         
    // function liquidate(address _trader, uint256 _positionId) external; // the liquidator fee will a % of the remaining collateral

    // getters
    function isTokenValid(address _token) external view returns (bool);
}
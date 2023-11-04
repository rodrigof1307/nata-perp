export const perpABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxLiquidityThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxLeveragePerPosition",
        type: "uint256",
      },
      { internalType: "uint256", name: "_liquidatorFee", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [{ internalType: "int256", name: "value", type: "int256" }],
    name: "SafeCastOverflowedIntToUint",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
    name: "SafeCastOverflowedUintToInt",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralDecreased",
        type: "uint256",
      },
    ],
    name: "CollateralDecreased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralIncreased",
        type: "uint256",
      },
    ],
    name: "CollateralIncreased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeWithdrawn",
        type: "uint256",
      },
    ],
    name: "FeesClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LiquidityDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LiquidityWithdrawed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "PositionClosed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "PositionOpened",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: false,
        internalType: "uint256",
        name: "sizeDecreased",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "realizedPnl",
        type: "int256",
      },
    ],
    name: "SizeDecreased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
      {
        indexed: false,
        internalType: "uint256",
        name: "sizeIncreased",
        type: "uint256",
      },
    ],
    name: "SizeIncreased",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "claimFees",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "bytes32", name: "_positionId", type: "bytes32" },
    ],
    name: "closePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "bytes32", name: "_positionId", type: "bytes32" },
      {
        internalType: "uint256",
        name: "_collateralToWithdraw",
        type: "uint256",
      },
    ],
    name: "decreaseCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "bytes32", name: "_positionId", type: "bytes32" },
      {
        internalType: "uint256",
        name: "_sizeAmountToDecrease",
        type: "uint256",
      },
    ],
    name: "decreaseSize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_liquidityAmount", type: "uint256" },
    ],
    name: "depositLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "fees",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "getTokenLiquidity",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "total", type: "uint256" },
          { internalType: "uint256", name: "openInterest", type: "uint256" },
        ],
        internalType: "struct IPerpetuals.Liquidity",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "address", name: "_token", type: "address" },
    ],
    name: "getUserTokenLiquidity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "bytes32", name: "_positionId", type: "bytes32" },
      {
        internalType: "uint256",
        name: "_collateralToDeposit",
        type: "uint256",
      },
    ],
    name: "increaseCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "bytes32", name: "_positionId", type: "bytes32" },
      {
        internalType: "uint256",
        name: "_sizeAmountToIncrease",
        type: "uint256",
      },
    ],
    name: "increaseSize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "isTokenValid",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_trader", type: "address" },
      { internalType: "bytes32", name: "_positionId", type: "bytes32" },
    ],
    name: "liquidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidatorFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "liquidityPerUser",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLeveragePerPosition",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLiquidityThreshold",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_size", type: "uint256" },
      { internalType: "uint256", name: "_collateralAmount", type: "uint256" },
      {
        internalType: "enum IPerpetuals.PositionType",
        name: "_posType",
        type: "uint8",
      },
    ],
    name: "openPosition",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "oracles",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "bytes32", name: "", type: "bytes32" },
    ],
    name: "positions",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "uint256", name: "size", type: "uint256" },
      { internalType: "uint256", name: "collateral", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      {
        internalType: "enum IPerpetuals.PositionType",
        name: "posType",
        type: "uint8",
      },
      { internalType: "bool", name: "closed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_allowedTokens", type: "address[]" },
      { internalType: "address[]", name: "_oracles", type: "address[]" },
    ],
    name: "setAllowedTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_liquidatorFee", type: "uint256" },
    ],
    name: "setLiquidatorFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxLeveragePerPosition",
        type: "uint256",
      },
    ],
    name: "setMaxLeveragePerPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxLiquidityThreshold",
        type: "uint256",
      },
    ],
    name: "setMaxLiquidityThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "totalLiquidity",
    outputs: [
      { internalType: "uint256", name: "total", type: "uint256" },
      { internalType: "uint256", name: "openInterest", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_liquidityAmount", type: "uint256" },
    ],
    name: "withdrawLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const http = require("http");
const ethers = require("ethers");
const axios = require("axios");
const port = 8080;

// PROVIDER
const providerPolygon = ethers.getDefaultProvider(
  "https://rpc.public.zkevm-test.net"
);
const providerGnosis = ethers.getDefaultProvider("https://rpc.ankr.com/gnosis");
// ADDRESS
const nataPerpContractAddressPolygon =
  "0x1d2A5e157022293A0bC12C9b9Fd20Bc0Cf320869";
const nataPerpContractAddressGnosis = "0x57B0d98Fdd5621ACdf92047e62Ba39D9A4582dd6";
// ABI
const nataPerpAbi = [
  "function positions(address, bytes32) view returns (address token, uint256 timestamp, uint256 size, uint256 collateral, uint256 price, uint8 posType, bool closed)",
  "event PositionOpened(address indexed user, bytes32 indexed id, uint256 chainid)",
  "event PositionClosed(address indexed user, bytes32 indexed id)",
  "event CollateralIncreased(address indexed user, bytes32 indexed id, uint256 newCollateral)",
  "event CollateralDecreased(address indexed user, bytes32 indexed id, uint256 newCollateral)",
  "event SizeIncreased(address indexed user, bytes32 indexed id, uint256 newSize)",
  "event SizeDecreased(address indexed user, bytes32 indexed id, uint256 newSize, int256 realizedPnl)",
  "event UserLiquidated(address indexed user, bytes32 indexed id, address liquidator)"
];
// CONTRACT
const nataPerpContractPolygon = new ethers.Contract(
  nataPerpContractAddressPolygon,
  nataPerpAbi,
  providerPolygon
);
const nataPerpContractGnosis = new ethers.Contract(
  nataPerpContractAddressGnosis,
  nataPerpAbi,
  providerGnosis
);

// SERVER
http
  .createServer(() => {})
  .listen(port, (error) => {
    if (error) {
      console.log("Something went wrong", error);
    } else {
      // Polygon
      nataPerpContractPolygon.on("PositionOpened", handlePositionOpened);
      nataPerpContractPolygon.on("PositionClosed", handlePositionClosed);
      nataPerpContractPolygon.on(
        "CollateralIncreased",
        handleCollateralIncreased
      );
      nataPerpContractPolygon.on(
        "CollateralDecreased",
        handleCollateralDecreased
      );
      nataPerpContractPolygon.on("SizeIncreased", handleSizeIncreased);
      nataPerpContractPolygon.on("SizeDecreased", handleSizeDecreased);
      nataPerpContractPolygon.on("UserLiquidated", handleUserLiquidated);
      // Gnosis
      nataPerpContractGnosis.on("PositionOpened", handlePositionOpened);
      nataPerpContractGnosis.on("PositionClosed", handlePositionClosed);
      nataPerpContractGnosis.on(
        "CollateralIncreased",
        handleCollateralIncreased
      );
      nataPerpContractGnosis.on(
        "CollateralDecreased",
        handleCollateralDecreased
      );
      nataPerpContractGnosis.on("SizeIncreased", handleSizeIncreased);
      nataPerpContractGnosis.on("SizeDecreased", handleSizeDecreased);
      nataPerpContractGnosis.on("UserLiquidated", handleUserLiquidated);
    }
  });

// HANDLERS
const handlePositionOpened = async (user, id, chainId, event) => {
  let position = (chainId.toString() == "1442") ? await nataPerpContractPolygon.positions(user, id) : await nataPerpContractGnosis.positions(user, id);

  axios
    .post("http://localhost:3001/positions", {
      position: {
        positionId: id,
        chainId: chainId.toString(),
        user: user,
        token: position["token"],
        timestamp: new Date(parseInt(position["timestamp"]) * 1000),
        size: parseFloat(ethers.utils.formatEther(position["size"])),
        collateral: parseFloat(
          ethers.utils.formatEther(position["collateral"])
        ),
        price: parseFloat(ethers.utils.formatUnits(position["price"], 18)),
        posType: position["posType"] == 0 ? "LONG" : "SHORT",
        closed: position["closed"],
        liquidated: false,
      },
    })
    .then(function (response) {
      console.log("POSITION OPENED");
    })
    .catch(function (error) {
      console.log("ERROR: POSITION OPENED");
    });
};

const handlePositionClosed = (user, id, event) => {
  axios
    .put(`http://localhost:3001/positions/${id}`, {
      position: {
        closed: true,
      },
    })
    .then(function (response) {
      console.log("POSITION CLOSED");
    })
    .catch(function (error) {
      console.log("ERROR: POSITION CLOSED");
    });
};

const handleCollateralIncreased = (user, id, newCollateral, event) => {
  axios
    .put(`http://localhost:3001/positions/${id}`, {
      collateral: parseFloat(
        ethers.utils.formatEther(newCollateral)
      ),
    })
    .then(function (response) {
      console.log("COLLATERAL INCREASED");
    })
    .catch(function (error) {
      console.log("ERROR: COLLATERAL INCREASED");
    });
};

const handleCollateralDecreased = (user, id, newCollateral, event) => {
  axios
    .put(`http://localhost:3001/positions/${id}`, {
      collateral: parseFloat(
        ethers.utils.formatEther(newCollateral)
      ),
    })
    .then(function (response) {
      console.log("COLLATERAL DECREASED");
    })
    .catch(function (error) {
      console.log("ERROR: COLLATERAL DECREASED");
    });
};

const handleSizeIncreased = (user, id, newSize, event) => {
  axios
    .put(`http://localhost:3001/positions/${id}`, {
      size: parseFloat(
        ethers.utils.formatEther(newSize)
      ),
    })
    .then(function (response) {
      console.log("SIZE INCREASED");
    })
    .catch(function (error) {
      console.log("ERROR: SIZE INCREASED");
    });
};

const handleSizeDecreased = (user, id, newSize, realizedPnl, event) => {
  axios
    .put(`http://localhost:3001/positions/${id}`, {
      size: parseFloat(
        ethers.utils.formatEther(newSize)
      ),
    })
    .then(function (response) {
      console.log("SIZE DECREASED");
    })
    .catch(function (error) {
      console.log("ERROR: SIZE DECREASED");
    });
};

const handleUserLiquidated = (user, id, liquidator, event) => {
  axios
    .put(`http://localhost:3001/positions/${id}`, {
      position: {
        liquidated: true,
      },
    })
    .then(function (response) {
      console.log("POSITION LIQUIDATED");
    })
    .catch(function (error) {
      console.log("ERROR: POSITION LIQUIDATED");
    });
}

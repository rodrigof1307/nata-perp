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
const nataPerpContractAddressGnosis = "TODO";
// ABI
const nataPerpAbi = [
  "function positions(address, bytes32) view returns (address token, uint256 timestamp, uint256 size, uint256 collateral, uint256 price, uint8 posType, bool closed)",
  "event PositionOpened(address indexed user, bytes32 indexed id, uint256 chainid)",
  "event PositionClosed(address indexed user, bytes32 indexed id)",
  "event CollateralIncreased(address indexed user, bytes32 indexed id, uint256 collateralIncreased)",
  "event CollateralDecreased(address indexed user, bytes32 indexed id, uint256 collateralDecreased)",
  "event SizeIncreased(address indexed user, bytes32 indexed id, uint256 sizeIncreased)",
  "event SizeDecreased(address indexed user, bytes32 indexed id, uint256 sizeDecreased, int256 realizedPnl)",
];
// CONTRACT
const nataPerpContractPolygon = new ethers.Contract(
  nataPerpContractAddressPolygon,
  nataPerpAbi,
  providerPolygon
);
// const nataPerpContractGnosis = new ethers.Contract(
//   nataPerpContractAddressGnosis,
//   nataPerpAbi,
//   providerGnosis
// );

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
      // Gnosis
      // nataPerpContractGnosis.on("PositionOpened", handlePositionOpened);
      // nataPerpContractGnosis.on("PositionClosed", handlePositionClosed);
      // nataPerpContractGnosis.on(
      //   "CollateralIncreased",
      //   handleCollateralIncreased
      // );
      // nataPerpContractGnosis.on(
      //   "CollateralDecreased",
      //   handleCollateralDecreased
      // );
      // nataPerpContractGnosis.on("SizeIncreased", handleSizeIncreased);
      // nataPerpContractGnosis.on("SizeDecreased", handleSizeDecreased);
    }
  });

// HANDLERS
const handlePositionOpened = async (user, id, chainId, event) => {
  console.log(`chainId: ${chainId.toString()}`);
  let position = await nataPerpContractPolygon.positions(user, id);

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

const handleCollateralIncreased = (user, id, collateralIncreased, event) => {
  console.log("COLLATERAL INCREASED");
};

const handleCollateralDecreased = (user, id, collateralDecreased, event) => {
  console.log("COLLATERAL DECREASED");
};

const handleSizeIncreased = (user, id, sizeIncreased, event) => {
  console.log("SIZE INCREASED");
};

const handleSizeDecreased = (user, id, sizeDecreased, realizedPnl, event) => {
  console.log("SIZE DECREASED");
};

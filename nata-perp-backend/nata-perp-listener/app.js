const http = require('http') 
const ethers = require("ethers")
const axios = require("axios")
const port = 8080
const provider = ethers.getDefaultProvider("https://polygonzkevm-testnet.g.alchemy.com/v2/osucqkh--UPxbR9GsVaiGp1FJ98ITMjJ")
const nataPerpContractAddress = "0x74CA2C75bC0A4e8B20A3904Be9f4d4d20e918378"
const nataPerpAbi = [
  "function positions(address, bytes32) view returns (address token, uint256 timestamp, uint256 size, uint256 collateral, uint256 price, uint8 posType, bool closed)",
  "event PositionOpened(address indexed user, bytes32 indexed id)",
  "event PositionClosed(address indexed user, bytes32 indexed id)",
  "event CollateralIncreased(address indexed user, bytes32 indexed id, uint256 collateralIncreased)",
  "event CollateralDecreased(address indexed user, bytes32 indexed id, uint256 collateralDecreased)",
  "event SizeIncreased(address indexed user, bytes32 indexed id, uint256 sizeIncreased)",
  "event SizeDecreased(address indexed user, bytes32 indexed id, uint256 sizeDecreased, int256 realizedPnl)"
]
const nataPerpContract = new ethers.Contract(nataPerpContractAddress, nataPerpAbi, provider);

// Create a server object: 
http.createServer(() => {}).listen(port, (error) => {
  if (error) {
    console.log('Something went wrong', error); 
  }
  else { 
    nataPerpContract.on("PositionOpened", handlePositionOpened)
    nataPerpContract.on("PositionClosed", handlePositionClosed)
    nataPerpContract.on("CollateralIncreased", handleCollateralIncreased)
    nataPerpContract.on("CollateralDecreased", handleCollateralDecreased)
    nataPerpContract.on("SizeIncreased", handleSizeIncreased)
    nataPerpContract.on("SizeDecreased", handleSizeDecreased)
  }
})

const handlePositionOpened = async (user, id, event) => {
  // handle event and update db

  console.log("POSITION OPENED");
  console.log(`user: ${user}`);
  console.log(`id: ${id}`);
  let position = await nataPerpContract.positions(user, id)
  console.log("POSITION:")
  console.log(`token: ${position["token"]}`);
  console.log(`timestamp: ${new Date(parseInt(position["timestamp"]) * 1000)}`);
  console.log(`size: ${parseFloat(ethers.utils.formatEther(position["size"]))}`);
  console.log(`collateral: ${parseFloat(ethers.utils.formatEther(position["collateral"]))}`);
  console.log(`price: ${parseFloat(ethers.utils.formatUnits(position["price"], 18))}`);
  console.log(`posType: ${position["posType"] == 0 ? "LONG" : "SHORT"}`);
  console.log(`closed: ${position["closed"]}`);

  axios.post('http://localhost:3000/positions', {
    position: {
      positionId: id,
      user: user,
      token: position["token"],
      timestamp: new Date(parseInt(position["timestamp"]) * 1000),
      size: parseFloat(ethers.utils.formatEther(position["size"])),
      collateral: parseFloat(ethers.utils.formatEther(position["collateral"])),
      price: parseFloat(ethers.utils.formatUnits(position["price"], 18)),
      posType: position["posType"] == 0 ? "LONG" : "SHORT",
      closed: position["closed"],
      liquidated: false
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

const handlePositionClosed = (user, id, event) => {
  // handle event and update db
  console.log("POSITION CLOSED");
}

const handleCollateralIncreased = (user, id, collateralIncreased, event) => {
  // handle event and update db
  console.log("COLLATERAL INCREASED");
}

const handleCollateralDecreased = (user, id, collateralDecreased, event) => {
  // handle event and update db
  console.log("COLLATERAL DECREASED");
}

const handleSizeIncreased = (user, id, sizeIncreased, event) => {
  // handle event and update db
  console.log("SIZE INCREASED");
}

const handleSizeDecreased = (user, id, sizeDecreased, realizedPnl, event) => {
  // handle event and update db  
  console.log("SIZE DECREASED");
}


/*
  - Position
    - token       (string)
    - timestamp   (time)
    - size        (float)
    - collateral  (float)
    - price       (float)
    - posType     (string)
    - closed      (bool)
    - id          (string)
    - user        (string)
    - liquidated  (bool)
*/

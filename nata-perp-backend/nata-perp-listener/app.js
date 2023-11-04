// libs
const http = require('http') 
const ethers = require("ethers")
// port
const port = 8080
// nata perp contract address
const nataPerpContractAddress = "0x975C2B5260921bE6e08A89feC8108792Cb1F1563"
// Events
// const LiquidityDeposited = ethers.utils.id("LiquidityDeposited(address,address,uint256)")
// const LiquidityWithdrawed = ethers.utils.id("LiquidityWithdrawed(address,address,amount)")
const PositionOpened = ethers.utils.id("PositionOpened(address,bytes32)")
const PositionClosed = ethers.utils.id("PositionClosed(address,bytes32)")
const CollateralIncreased = ethers.utils.id("CollateralIncreased(address,bytes32,uint256)")
const CollateralDecreased = ethers.utils.id("CollateralDecreased(address,bytes32,uint256)")
const SizeIncreased = ethers.utils.id("SizeIncreased(address,bytes32,uint256)")
const SizeDecreased = ethers.utils.id("SizeDecreased(address,bytes32,uint256,int256)")
// const FeesClaimed = ethers.utils.id("FeesClaimed(address,uint256)")
// provider
const provider = ethers.getDefaultProvider("https://polygonzkevm-testnet.g.alchemy.com/v2/osucqkh--UPxbR9GsVaiGp1FJ98ITMjJ")
// filters
// const filterLiquidityDeposited = {
//   address: nataPerpContractAddress,
//   topics: [
//     LiquidityDeposited
//   ]
// }
// const filterLiquidityWithdrawed = {
//   address: nataPerpContractAddress,
//   topics: [
//     LiquidityWithdrawed
//   ]
// }
const filterPositionOpened = {
  address: nataPerpContractAddress,
  topics: [
    PositionOpened
  ]
}
const filterPositionClosed = {
  address: nataPerpContractAddress,
  topics: [
    PositionClosed
  ]
}
const filterCollateralIncreased = {
  address: nataPerpContractAddress,
  topics: [
    CollateralIncreased,
  ]
}
const filterCollateralDecreased = {
  address: nataPerpContractAddress,
  topics: [
    CollateralDecreased
  ]
}
const filterSizeIncreased = {
  address: nataPerpContractAddress,
  topics: [
    SizeIncreased
  ]
}
const filterSizeDecreased = {
  address: nataPerpContractAddress,
  topics: [
    SizeDecreased
  ]
}
// const filterFeesClaimed = {
//   address: nataPerpContractAddress,
//   topics: [
//     FeesClaimed
//   ]
// }

// Create a server object: 
const server = http.createServer(() => {}).listen(port, () => {
  if (error) {
    console.log('Something went wrong', error); 
  }
  else {
    // provider.on(filterLiquidityDeposited, handleLiquidityDeposited) 
    // provider.on(filterLiquidityWithdrawed, handleLiquidityWithdrawed) 
    provider.on(filterPositionOpened, handlePositionOpened) 
    provider.on(filterPositionClosed, handlePositionClosed) 
    provider.on(filterCollateralIncreased, handleCollateralIncreased) 
    provider.on(filterCollateralDecreased, handleCollateralDecreased) 
    provider.on(filterSizeIncreased, handleSizeIncreased) 
    provider.on(filterSizeDecreased, handleSizeDecreased) 
    // provider.on(filterFeesClaimed, handleFeesClaimed)
  }
})

// const handleLiquidityDeposited = () => {

// }

// const handleLiquidityWithdrawed = () => {

// }

const handlePositionOpened = (log, event) => {
  // handle event and update db
}

const handlePositionClosed = (log, event) => {
  // handle event and update db
}

const handleCollateralIncreased = (log, event) => {
  // handle event and update db
}

const handleCollateralDecreased = (log, event) => {
  // handle event and update db
}

const handleSizeIncreased = (log, event) => {
  // handle event and update db
}

const handleSizeDecreased = (log, event) => {
  // handle event and update db  
}

// const handleFeesClaimed = () => {

// }
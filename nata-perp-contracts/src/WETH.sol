// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETH is ERC20 {
    constructor() ERC20("Wrapped ETH", "WETH") {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}

// 0x85a5E8E51bF22c48e3bd86D2f522e81222b14b3D - perps
// 0xc9Bb81d3668f03ec9109bBca77d32423DeccF9Ab - oracle WETH
// 0x10214283FdDdab8da3E40C43aF92BB8b86ccADbf - WETH 
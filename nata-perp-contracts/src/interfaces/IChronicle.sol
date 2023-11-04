// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IChronicle {
    function read() external view returns (uint256 value);
}

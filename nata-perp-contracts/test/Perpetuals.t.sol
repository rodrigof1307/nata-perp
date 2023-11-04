// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {Perpetuals} from "../src/Perpetuals.sol";

import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract PerpetualsTest is Test {
    Perpetuals public perps;

    address owner = makeAddr("owner");
    address trader = makeAddr("trader");
    address liquidityProvider = makeAddr("liquidity provider");

    ERC20Mock weth;
    ERC20Mock wbtc;

    function setUp() public {
        vm.startPrank(owner);
        perps = new Perpetuals(4000, 1000); // 40% threshold and 10x leverage
        weth = new ERC20Mock();
        wbtc = new ERC20Mock();

        weth.mint(liquidityProvider, 10 ether);
        weth.mint(trader, 1 ether);

        address[] memory tokens = new address[](1);
        tokens[0] = address(weth);

        perps.setAllowedTokens(tokens);
        assertEq(perps.isTokenValid(address(weth)), true);

        vm.stopPrank();
    }

    function testSetAllowedTokens() public {
        vm.startPrank(owner);
        address[] memory tokens = new address[](1);
        tokens[0] = address(wbtc);
        perps.setAllowedTokens(tokens);
        assertEq(perps.isTokenValid(address(wbtc)), true);
        vm.stopPrank();

        vm.startPrank(trader);
        vm.expectRevert();
        perps.setAllowedTokens(tokens);
        vm.stopPrank();
    }

    function testSetMaxLiquidityThreshold() public {
        vm.startPrank(owner);
        perps.setMaxLiquidityThreshold(5000);
        assertEq(perps.maxLiquidityThreshold(), 5000);

        vm.expectRevert("Liquidity threshold too high");
        perps.setMaxLiquidityThreshold(10000);
    
        vm.startPrank(trader);
        vm.expectRevert(); // not the owner
        perps.setMaxLiquidityThreshold(2000);
    }

    function testSetMaxLeveragePerPosition() public {
        vm.startPrank(owner);
        perps.setMaxLeveragePerPosition(2000);
        assertEq(perps.maxLeveragePerPosition(), 2000);

        vm.expectRevert("Leverage too high");
        perps.setMaxLeveragePerPosition(5000);

        vm.startPrank(trader);
        vm.expectRevert(); // not the owner
        perps.setMaxLeveragePerPosition(1000);
    }

    function testDepositLiquidity() public {
        vm.startPrank(liquidityProvider);

        weth.approve(address(perps), 1 ether);
        perps.depositLiquidity(address(weth), 1 ether);

        assertEq(perps.getUserTokenLiquidity(liquidityProvider, address(weth)), 1 ether);
        assertEq(perps.getTokenLiquidity(address(weth)).total, 1 ether);

        assertEq(weth.balanceOf(liquidityProvider), 9 ether);
        assertEq(weth.balanceOf(address(perps)), 1 ether);

        vm.stopPrank();
    }

    function testWithdrawLiquidity() public {
        testDepositLiquidity();

        vm.startPrank(liquidityProvider);
    
        perps.withdrawLiquidity(address(weth), 1 ether);
        assertEq(perps.getUserTokenLiquidity(liquidityProvider, address(weth)), 0 ether);
        assertEq(perps.getTokenLiquidity(address(weth)).total, 0 ether);

        assertEq(weth.balanceOf(liquidityProvider), 10 ether);
        assertEq(weth.balanceOf(address(perps)), 0 ether);

        vm.stopPrank();
    }

    function testOpenPosition() public {}

    function testIncreaseCollateral() public {} // not ready to test

    function testIncreaseSize() public {}

}
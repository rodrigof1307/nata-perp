// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {Perpetuals} from "../src/Perpetuals.sol";
import {IPerpetuals} from "../src/interfaces/IPerpetuals.sol";
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
        perps = new Perpetuals(4000, 1000, 500); // 40% threshold and 10x leverage
        weth = new ERC20Mock();
        wbtc = new ERC20Mock();

        weth.mint(liquidityProvider, 10 ether);
        weth.mint(trader, 1 ether);

        address[] memory tokens = new address[](1);
        tokens[0] = address(weth);

        perps.setAllowedTokens(tokens, tokens);
        assertEq(perps.isTokenValid(address(weth)), true);

        vm.stopPrank();
    }

    function testSetAllowedTokens() public {
        vm.startPrank(owner);
        address[] memory tokens = new address[](1);
        tokens[0] = address(wbtc);
        perps.setAllowedTokens(tokens, tokens);
        assertEq(perps.isTokenValid(address(wbtc)), true);
        vm.stopPrank();

        vm.startPrank(trader);
        vm.expectRevert();
        perps.setAllowedTokens(tokens, tokens);
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

    function testOpenPosition() public {
        //Só conseguimos abrir posição se tivermos collateral depositado
        testDepositLiquidity();

        vm.startPrank(trader);
        bytes32 id = perps.openPosition(address(weth), 1 ether, 2 ether, IPerpetuals.PositionType.LONG);
    
        //leverage tem de ser diferente de 0. (test size = 0 && collateral = 0)
        vm.expectRevert("Size can't be zero");
        perps.openPosition(address(weth), 0 ether, 0 ether, IPerpetuals.PositionType.LONG);
        vm.expectRevert("Collateral can't be zero");
        perps.openPosition(address(weth), 0 ether, 0 ether, IPerpetuals.PositionType.SHORT);
    
        //A Liquidez total de todas as posições abertas do token deve ser += size    
        assertEq(perps.getTokenLiquidity(address(weth)).openInterest >= perps.getUserPosition(trader, id).size, true);

        vm.stopPrank();
    }

    function testIncreaseCollateral() public {
        vm.startPrank(trader);

        //crio uma posição que sei o id
        bytes32 id = perps.openPosition(address(weth), 1 ether, 1 ether, IPerpetuals.PositionType.LONG);
        //adiciono 1 ether ao colateral da posição do id
        perps.increaseCollateral(address(weth), id , 1 ether);
        //trader não pode aumentar 0 ether de collateral
        vm.expectRevert("O valor nao esta autorizado");
        perps.increaseCollateral(address(weth), id, 0 ether);
        //Atualização da liquidez do token com o valor do aumento do collateral
        assertEq(perps.getTokenLiquidity(address(weth)).total, 2 ether);   

        vm.stopPrank();
    } 

    function testIncreaseSize() public {}
}

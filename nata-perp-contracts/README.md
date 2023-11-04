## nata-perp-contracts
Make a brief explanation of the system and how to ccontracts work.

- Traders can decrease the size of their position and realize a proportional amount of their PnL.
- Traders can decrease the collateral of their position.
- Individual position’s can be liquidated with a `liquidate` function, any address may invoke the `liquidate` function.
- A `liquidatorFee` is taken from the position’s remaining collateral upon liquidation with the `liquidate` function and given to the caller of the `liquidate` function.

### Contracts
Addresses of the contracts in the zkEVM:
* Perpetuals : 0x975C2B5260921bE6e08A89feC8108792Cb1F1563
* Mock WBTC : 0x9fDAF28A87689e2F5002A2237Dcd3efe41aB9c48
* Mock WETH : 0x1B695aaFF1F384241000b17c76bC0A923C5682A2

call setAllowedTokens with:
1 -> Mock WBTC (0x9fDAF28A87689e2F5002A2237Dcd3efe41aB9c48) -> WBTC Oracle (0x39C899178F4310705b12888886884b361CeF26C7)
2 -> Mock WETH (0x1B695aaFF1F384241000b17c76bC0A923C5682A2) -> WETH Oracle (0x8Ba43F8Fa2fC13D7EEDCeb9414CDbB6643483C34)

Addresses of the contracts in the Gnosis Chain:
* Perpetuals :
* Mock WBTC :
* Mock WETH :

call setAllowedTokens with:
1 -> Mock WBTC () -> WBTC Oracle ()
2 -> Mock WETH () -> WETH Oracle ()

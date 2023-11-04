## nata-perp-contracts
Make a brief explanation of the system and how to ccontracts work.

- Traders can decrease the size of their position and realize a proportional amount of their PnL.
- Traders can decrease the collateral of their position.
- Individual position’s can be liquidated with a `liquidate` function, any address may invoke the `liquidate` function.
- A `liquidatorFee` is taken from the position’s remaining collateral upon liquidation with the `liquidate` function and given to the caller of the `liquidate` function.

### Contracts
Addresses of the contracts in the zkEVM:
* Perpetuals : 0x806C69043A38B27588b4BDa4a248eeACa19B497e
* Mock WBTC : 0x90C4ED46c0bB465b588E3770D805Eec108C873d4
* Mock WETH : 0x78E361430B3fe89167e45e754be532052861Bc58

call setAllowedTokens with:
1 -> Mock WBTC (0x90C4ED46c0bB465b588E3770D805Eec108C873d4) -> WBTC Oracle (0x39C899178F4310705b12888886884b361CeF26C7)
2 -> Mock WETH (0x78E361430B3fe89167e45e754be532052861Bc58) -> WETH Oracle (0x8Ba43F8Fa2fC13D7EEDCeb9414CDbB6643483C34)

Addresses of the contracts in the Gnosis Chain:
* Perpetuals :
* Mock WBTC :
* Mock WETH :

call setAllowedTokens with:
1 -> Mock WBTC () -> WBTC Oracle ()
2 -> Mock WETH () -> WETH Oracle ()

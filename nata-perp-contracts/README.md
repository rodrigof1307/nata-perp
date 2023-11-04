## nata-perp-contracts
Make a brief explanation of the system and how to ccontracts work.

- Traders can decrease the size of their position and realize a proportional amount of their PnL.
- Traders can decrease the collateral of their position.
- Individual position’s can be liquidated with a `liquidate` function, any address may invoke the `liquidate` function.
- A `liquidatorFee` is taken from the position’s remaining collateral upon liquidation with the `liquidate` function and given to the caller of the `liquidate` function.

### Contracts
Addresses of the contracts in the zkEVM:
* Perpetuals : 0xf43c4182aC1002d00Ebfe29905815d7a10FeDA7E
* Mock WBTC : 0x66610b7801BeD1f036b79ba55640Af9B3DADd4c0
* Oracle WBTC : 0x39C899178F4310705b12888886884b361CeF26C7
* Mock WETH : 0xC59439A27fe525Aaa78e9Eb370cc62c6B68D6052
* Oracle WETH : 0x8Ba43F8Fa2fC13D7EEDCeb9414CDbB6643483C34

Addresses of the contracts in the Gnosis Chain:
* Perpetuals :
* Mock WBTC :
* Mock WETH :

call setAllowedTokens with:
1 -> Mock WBTC () -> WBTC Oracle ()
2 -> Mock WETH () -> WETH Oracle ()

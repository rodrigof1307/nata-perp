## nata-perp-contracts
Make a brief explanation of the system and how to contracts work.

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
* Perpetuals : 0x57B0d98Fdd5621ACdf92047e62Ba39D9A4582dd6
* WBTC : 0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252
* WETH : 0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1
* Oracle WBTC : 0xA7226d85CE5F0DE97DCcBDBfD38634D6391d0584
* Oracle WETH : 0xc8A1F9461115EF3C1E84Da6515A88Ea49CA97660

call setAllowedTokens with:
1 -> Mock WBTC () -> WBTC Oracle ()
2 -> Mock WETH () -> WETH Oracle ()

### Notes
All contracts leverage interfaces and utilities from OpenZeppellin

# Nata Perp

Nata Perp is a perpetual trading DEX with a manual liquidation mechanism to close over-leveraged positions. 

We have three roles in our DEX: Traders, liquidity providers, and Liquidators.

Since the beginning of our DEX, the battle between traders and liquidity providers has been intense. Liquidity providers and traders are in fierce competition, both striving for victory in the market. Liquidity providers aim to maximize the fees earned from traders' liquidated positions.

We have implemented a staking mechanism to distribute to rewards accordingly to liquidity providers.

After a trader deposits collateral, they can open a Long/Short position with a maximum leverage of 20x.

Once a trader has opened their positions, they can increase or decrease their collateral, and this action impacts their position. If a trader increases his collateral, the leverage of his open position decreases. If a trader decreases his collateral, the leverage of his open position increases. When the leverage exceeds the maximum threshold defined by NataPerps, the open position can be liquidated.

NataPerps Dex has integrated Chronicle Oracle for real-time token price updates on Polygon zkEVM and Gnosis Chain.

Nata Perp also features a feed and a subscription system which leverage Web3Inbox.

All contracts leverage interfaces and utilities from OpenZeppellin.

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

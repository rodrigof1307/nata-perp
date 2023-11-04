"use client";

import { FC } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

interface ChartProps {
  selectedCryptoID: string;
}

const Chart: FC<ChartProps> = ({ selectedCryptoID }) => {
  const symbolGenerator = (selectedCryptoID: string) => {
    if (selectedCryptoID === "ethereum") {
      return "CRYPTO:ETHUSD";
    }
    if (selectedCryptoID === "bitcoin") {
      return "CRYPTO:BTCUSD";
    }
    return "CRYPTO:ETHUSD";
  };

  return (
    <div>
      <AdvancedRealTimeChart
        theme="dark"
        interval="5"
        hide_side_toolbar
        allow_symbol_change={false}
        symbol={symbolGenerator(selectedCryptoID)}
        width={1000}
        height={550}
      />
    </div>
  );
};

export default Chart;

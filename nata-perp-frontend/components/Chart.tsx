"use client";

import { FC } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { cryptosInfo } from "@/lib/cryptosInfo";

interface ChartProps {
  selectedCryptoID: string;
}

const Chart: FC<ChartProps> = ({ selectedCryptoID }) => {
  return (
    <div>
      <AdvancedRealTimeChart
        theme="dark"
        interval="5"
        hide_side_toolbar
        allow_symbol_change={false}
        symbol={
          //@ts-ignore
          cryptosInfo[selectedCryptoID].tradingViewSymbold
        }
        width={1000}
        height={550}
      />
    </div>
  );
};

export default Chart;

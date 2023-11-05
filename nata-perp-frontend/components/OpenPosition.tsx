"use client";

import { FC } from "react";
import Box from "./ui/Box";
import { Button } from "./ui/button";
import { usePerpContractWrite } from "@/hooks/usePerpContractWrite";

interface OpenPositionProps {
  id: number;
  type: "LONG" | "SHORT";
  collateral: number;
  size: number;
  entryPrice: number;
  currentPrice: number;
  selectedCryptoID: string;
  tokenAddress: string;
}

const OpenPosition: FC<OpenPositionProps> = ({
  id,
  type,
  collateral,
  size,
  entryPrice,
  currentPrice,
  selectedCryptoID,
  tokenAddress,
}) => {
  const { writeAsync: writeClosePosition } = usePerpContractWrite({
    functionName: "closePosition",
    selectedCryptoID,
  });

  const delta =
    type === "LONG" ? currentPrice - entryPrice : entryPrice - currentPrice;
  const profitAndLoss = delta * size;
  const currentLeverage =
    (size * entryPrice) / (collateral * entryPrice - profitAndLoss);
  const isLiquidable = currentLeverage > 20;

  const handleClosePosition = async () => {
    console.log("Closing position", id);
    await writeClosePosition({
      args: [tokenAddress, id],
    });
  };

  return (
    <Box className="flex w-full flex-row items-center justify-start rounded-xl p-6 text-center font-light text-orange-600">
      <h2 className="w-[9%]">{type}</h2>
      <h2 className="w-[13%]">{collateral}</h2>
      <h2 className="w-[13%]">{size}</h2>
      <h2 className="w-[13%]">{entryPrice + " $"}</h2>
      <h2 className="w-[13%]">{currentPrice + " $"}</h2>
      <h2 className="w-[13%]">{profitAndLoss.toFixed(2) + " $"}</h2>
      <h2 className="w-[11%]">{currentLeverage.toFixed(2)}</h2>
      <div className="flex-1" />
      <Button
        variant={"full"}
        disabled={!isLiquidable}
        onClick={handleClosePosition}
      >
        Close Position
      </Button>
    </Box>
  );
};

export default OpenPosition;

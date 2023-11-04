import { FC } from "react";
import Box from "./ui/Box";
import { Button } from "./ui/button";

enum Position {
  Long = 0,
  Short = 1,
}

interface OpenPositionProps {
  type: Position;
  collateral: number;
  size: number;
  entryPrice: number;
  currentPrice: number;
}

const OpenPosition: FC<OpenPositionProps> = ({
  type,
  collateral,
  size,
  entryPrice,
  currentPrice,
}) => {
  const delta =
    type === Position.Long
      ? currentPrice - entryPrice
      : entryPrice - currentPrice;
  const profitAndLoss = delta * size;
  const currentLeverage =
    (size * entryPrice) / (collateral * entryPrice - profitAndLoss);
  const isLiquidable = currentLeverage > 20;

  return (
    <Box className="flex w-full flex-row items-center justify-start rounded-xl p-6 text-center font-light text-orange-600">
      <h2 className="w-[9%]">{type === Position.Long ? "Long" : "Short"}</h2>
      <h2 className="w-[13%]">{collateral}</h2>
      <h2 className="w-[13%]">{size}</h2>
      <h2 className="w-[13%]">{entryPrice + " $"}</h2>
      <h2 className="w-[13%]">{currentPrice + " $"}</h2>
      <h2 className="w-[13%]">{profitAndLoss.toFixed(2) + " $"}</h2>
      <h2 className="w-[11%]">{currentLeverage.toFixed(2)}</h2>
      <div className="flex-1" />
      <Button variant={"full"} disabled={!isLiquidable}>
        Close Position
      </Button>
    </Box>
  );
};

export default OpenPosition;

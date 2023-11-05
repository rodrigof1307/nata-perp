"use client";

import { FC } from "react";
import Box from "./ui/Box";
import { Button } from "./ui/button";
import { usePerpContractWrite } from "@/hooks/usePerpContractWrite";
import { useChainId } from "wagmi";

interface OpenPositionProps {
  id: number;
  type: "LONG" | "SHORT";
  collateral: number;
  size: number;
  entryPrice: number;
  currentPrice: number;
  selectedCryptoID: string;
  tokenAddress: string;
  user: string;
  liquidateMode: boolean;
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
  user,
  liquidateMode,
}) => {
  const { writeAsync: writeLiquidate } = usePerpContractWrite({
    functionName: "liquidate",
    selectedCryptoID,
  });

  const { writeAsync: writeClose } = usePerpContractWrite({
    functionName: "closePosition",
    selectedCryptoID,
  });

  const delta =
    type === "LONG" ? currentPrice - entryPrice : entryPrice - currentPrice;
  const profitAndLoss = delta * size;
  const currentLeverage =
    (size * entryPrice) / (collateral * entryPrice - profitAndLoss);
  const isLiquidable = currentLeverage > 20;

  const chainId = useChainId();

  const sendNotification = async (title: string) => {
    await fetch(
      `https://notify.walletconnect.com/${
        process.env.NEXT_PUBLIC_PROJECT_ID ?? ""
      }/notify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTIFY ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notification: {
            type: "0de41dc4-845a-4f70-b420-809cc832d71e", // Notification type ID copied from Cloud
            title: title,
            body: "Position id: " + id,
          },
          accounts: [
            `eip155:${chainId}:${user}`, // CAIP-10 account ID
          ],
        }),
      }
    );
  };

  const handleClose = async () => {
    await writeClose({
      args: [tokenAddress, id],
    });
    await sendNotification("You closed your position!");
  };

  const handleLiquidate = async () => {
    await writeLiquidate({
      args: [user, id],
    });
    await sendNotification("Your position has been liquidated!");
  };

  return (
    <Box className="flex w-full flex-row items-center justify-start rounded-xl p-6 text-center font-light text-orange-600">
      <h2 className="w-[9%]">{type}</h2>
      <h2 className="w-[13%]">{collateral}</h2>
      <h2 className="w-[13%]">{size}</h2>
      <h2 className="w-[13%]">{entryPrice.toFixed(2) + " $"}</h2>
      <h2 className="w-[13%]">{currentPrice.toFixed(2) + " $"}</h2>
      <h2 className="w-[13%]">{profitAndLoss.toFixed(2) + " $"}</h2>
      <h2 className="w-[11%]">{currentLeverage.toFixed(2)}</h2>
      <div className="flex-1" />
      <Button
        variant={"full"}
        size={"mid"}
        disabled={liquidateMode && !isLiquidable}
        onClick={liquidateMode ? handleLiquidate : handleClose}
      >
        {liquidateMode ? "Liquidate" : "Close"}
      </Button>
    </Box>
  );
};

export default OpenPosition;

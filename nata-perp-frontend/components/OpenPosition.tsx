"use client";

import { FC, useEffect, useState } from "react";
import Box from "./ui/Box";
import { Button } from "./ui/button";
import { usePerpContractWrite } from "@/hooks/usePerpContractWrite";
import { useChainId } from "wagmi";
import { shortenHash } from "@/lib/utils";
import { createPublicClient, http } from "viem";
import { polygonZkEvmTestnet, gnosis } from "viem/chains";

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
  onComplete?: () => void;
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
  onComplete,
}) => {
  const [publicClient, setPublicClient] = useState<any>();

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

  useEffect(() => {
    switch (chainId) {
      case 1442:
        const client1 = createPublicClient({
          chain: polygonZkEvmTestnet,
          transport: http(),
        });
        setPublicClient(client1);
        break;
      case 100:
        const client2 = createPublicClient({
          chain: gnosis,
          transport: http(),
        });
        setPublicClient(client2);
        break;
    }
  }, [chainId]);

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
            body:
              "ID: " +
              shortenHash(id.toString()) +
              " | " +
              type +
              " | " +
              profitAndLoss.toFixed(2) +
              " $ | " +
              (selectedCryptoID === "bitcoin" ? "BTC" : "ETH"),
          },
          accounts: [`eip155:${chainId}:${user}`],
        }),
      }
    );
  };

  const sendNotificationGeneral = async (title: string) => {
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
            body:
              "ID: " +
              shortenHash(id.toString()) +
              " | " +
              type +
              " | " +
              profitAndLoss.toFixed(2) +
              " $ | " +
              (selectedCryptoID === "bitcoin" ? "BTC" : "ETH"),
          },
          accounts: [
            `eip155:${chainId}:${"0x1Cd5956d6BDb1692e92113A3F2130435333e178D"}`,
          ],
        }),
      }
    );
  };

  const handleClose = async () => {
    const response1 = await writeClose({
      args: [tokenAddress, id],
    });

    const transaction1 = await publicClient.waitForTransactionReceipt({
      hash: response1.hash,
    });

    await sendNotification("You closed your position!");
    await sendNotificationGeneral("Someone closed a position!");

    if (onComplete) {
      onComplete();
    }
  };

  const handleLiquidate = async () => {
    const response1 = await writeLiquidate({
      args: [user, id],
    });

    const transaction1 = await publicClient.waitForTransactionReceipt({
      hash: response1.hash,
    });

    await sendNotification("Your position has been liquidated!");
    await sendNotificationGeneral("Someone's position has been liquidated!");

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Box className="flex w-full flex-row items-center justify-start rounded-xl p-6 text-center font-semibold text-orange-600">
      <h2 className="w-[9%]">{type}</h2>
      <h2 className="w-[13%]">{collateral.toFixed(2)}</h2>
      <h2 className="w-[13%]">{size.toFixed(2)}</h2>
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

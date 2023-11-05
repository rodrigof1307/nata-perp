"use client";

import { FC, useState } from "react";
import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from "@web3inbox/widget-react";
import {
  useSignMessage,
  useAccount,
  useChainId,
  erc20ABI,
  useContractWrite,
} from "wagmi";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainTokenInfo from "@/components/MainTokenInfo";
import Chart from "@/components/Chart";
import Box from "@/components/ui/Box";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePerpContractWrite } from "@/hooks/usePerpContractWrite";
import { cryptosInfo } from "@/lib/cryptosInfo";
import { createPublicClient, http } from "viem";
import { gnosis, polygonZkEvmTestnet } from "viem/chains";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import OpenPosition from "@/components/OpenPosition";

interface TradingProps {}

enum PositionType {
  Long = 0,
  Short = 1,
}

type Position = {
  id: number;
  positionId: string;
  user: string;
  chainId: null | string;
  closed: boolean;
  collateral: number;
  created_at: string;
  liquidated: boolean;
  posType: "LONG" | "SHORT"; // Assuming these are the possible types
  price: number;
  size: number;
  token: string;
  updated_at: string;
};

const Trading: FC<TradingProps> = ({}) => {
  const [selectedCryptoID, setSelectedCryptoID] = useState("bitcoin");
  const [position, setPosition] = useState(PositionType.Long);
  const chainID = useChainId();
  const [tokenAddress, setTokenAddress] = useState("");
  const [publicClient, setPublicClient] = useState<any>();
  const [perpAddress, setPerpAddress] = useState("");
  const { address: account } = useAccount();

  const fetchCryptoInfo = async ({ queryKey }: any) => {
    const { data } = await axios.get(`/api/getInfo/${queryKey[1]}`);
    return data;
  };

  const { data: dataCryptoInfo } = useQuery({
    queryKey: ["cryptoInfo", selectedCryptoID],
    queryFn: fetchCryptoInfo,
    retry: 1,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (cryptosInfo === undefined) {
      return;
    }

    switch (chainID) {
      case 1442:
        // @ts-ignore
        setTokenAddress(cryptosInfo[selectedCryptoID].wrappedTokenZKEvmAddress);
        setPerpAddress(process.env.NEXT_PUBLIC_PERP_ADDRESS_ZK_EVM!);
        break;
      case 100:
        setTokenAddress(
          // @ts-ignore
          cryptosInfo[selectedCryptoID].wrappedTokenGnosisAddress
        );
        setPerpAddress(process.env.NEXT_PUBLIC_PERP_ADDRESS_GNOSIS!);
        break;
    }
  }, [chainID, selectedCryptoID]);

  useEffect(() => {
    switch (chainID) {
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
  }, [chainID]);

  const { write: writeOpenPosition } = usePerpContractWrite({
    functionName: "openPosition",
    selectedCryptoID,
  });

  const { writeAsync: writeRequestApproval } = useContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: "approve",
  });

  const openPosition = async ({
    token,
    size,
    collateralAmount,
    posType,
  }: {
    token: string;
    size: number;
    collateralAmount: number;
    posType: PositionType;
  }) => {
    const response1 = await writeRequestApproval({
      args: [perpAddress as `0x${string}`, BigInt(collateralAmount)],
    });

    const transaction = await publicClient.waitForTransactionReceipt({
      hash: response1.hash,
    });

    console.log(token, size, collateralAmount, posType);
    const response = await writeOpenPosition({
      args: [token, BigInt(size), BigInt(collateralAmount), posType],
    });
    console.log(response);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchPositions = async () => {
    const { data } = await axios.get("http://localhost:3001/positions");
    return data
      .filter(
        (position: Position) =>
          position.user === account &&
          position.closed === false &&
          position.liquidated === false
      )
      .map((position: Position) => ({
        id: position.positionId,
        type: position.posType, // Assuming you have this kind of mapping
        collateral: position.collateral,
        size: position.size,
        entryPrice: position.price, // Assuming 'data?.price' is global or fetched from elsewhere
        token: position.token,
        user: position.user,
      }));
  };

  const { data: dataPositions, refetch } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
    retry: 1,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-between p-12">
      <MainTokenInfo
        selectedCryptoID={selectedCryptoID}
        setSelectedCryptoID={setSelectedCryptoID}
      />
      <div className="mt-4 flex w-full flex-row items-start justify-between">
        <Chart selectedCryptoID={selectedCryptoID} />
        <Box className="flex h-[518px] w-[350px] flex-col items-center justify-start p-4">
          <div className="mb-4 flex w-full flex-row items-center justify-between gap-2 rounded-lg bg-zinc-700 p-1.5">
            <button
              className={cn(
                "rounded-lg flex-1 hover:bg-orange-600/30 bg-zinc-700 text-center text-white py-2",
                position == PositionType.Long
                  ? "bg-orange-600 hover:bg-orange-600"
                  : ""
              )}
              onClick={() => setPosition(PositionType.Long)}
            >
              Long
            </button>
            <button
              className={cn(
                "rounded-lg flex-1 hover:bg-orange-600/30 bg-zinc-700 text-center text-white py-2",
                position == PositionType.Short
                  ? "bg-orange-600 hover:bg-orange-600"
                  : ""
              )}
              onClick={() => setPosition(PositionType.Short)}
            >
              Short
            </button>
          </div>
          <form
            onSubmit={handleSubmit(async (data) => {
              let size = Number(data.collateral) * Number(data.leverage);

              await openPosition({
                token: tokenAddress,
                size: size,
                collateralAmount: Number(data.collateral),
                posType: position,
              });

              reset();
            })}
            className="flex w-full flex-1 flex-col items-center justify-between"
          >
            <div className="w-full flex-1">
              <Label htmlFor="collateral" className="mb-4">
                Collateral
              </Label>
              <Input
                {...register("collateral", {
                  required: "This is required",
                  min: {
                    value: 0,
                    message: "Minimum collateral is 0",
                  },
                })}
                placeholder="Collateral"
              />
              {errors.collateral?.message ? (
                <p className="h-6 font-light text-red-600">
                  {errors.collateral.message.toString()}
                </p>
              ) : (
                <div className="h-6" />
              )}
              <Label htmlFor="leverage" className="mb-4 mt-6">
                Leverage
              </Label>
              <Input
                {...register("leverage", {
                  required: "This is required",
                  min: {
                    value: 1.1,
                    message: "Minimum leverage is 1.1",
                  },
                  max: {
                    value: 20,
                    message: "Maximum leverage is 20",
                  },
                })}
                placeholder="Leverage"
              />
              {errors.leverage?.message ? (
                <p className="h-6 font-light text-red-600">
                  {errors.leverage.message.toString()}
                </p>
              ) : (
                <div className="h-6" />
              )}
            </div>
            <Button
              variant={"full"}
              className="w-full"
              size={"lg"}
              type="submit"
            >
              Open Position
            </Button>
          </form>
        </Box>
      </div>
      <div className="mt-6 flex w-full flex-col items-center justify-between gap-4">
        <h2 className="mb-2 w-full text-left text-2xl font-semibold text-white">
          Your Open Positions
        </h2>
        <div className="-mb-1 flex w-full flex-row justify-start px-6 text-center text-white">
          <h2 className="w-[9%]">Type</h2>
          <h2 className="w-[13%]">Collateral</h2>
          <h2 className="w-[13%]">Size</h2>
          <h2 className="w-[13%]">Entry Price</h2>
          <h2 className="w-[13%]">Current Price</h2>
          <h2 className="w-[13%]">Profit and Loss</h2>
          <h2 className="w-[11%]">Current Leverage</h2>
        </div>
        {dataCryptoInfo &&
          dataPositions?.map((position: any) => (
            <OpenPosition
              key={position.id}
              id={position.id}
              type={position.type}
              collateral={position.collateral}
              size={position.size}
              entryPrice={position.entryPrice}
              currentPrice={dataCryptoInfo.price}
              selectedCryptoID={selectedCryptoID}
              tokenAddress={position.token}
              user={position.user}
              liquidateMode={false}
            />
          ))}
      </div>
    </div>
  );
};
export default Trading;

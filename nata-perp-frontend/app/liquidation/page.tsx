"use client";

import MainTokenInfo from "@/components/MainTokenInfo";
import OpenPosition from "@/components/OpenPosition";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { cryptosInfo } from "@/lib/cryptosInfo";
import { useAccount } from "wagmi";

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

interface LiquidationProps {}

const Liquidation: FC<LiquidationProps> = ({}) => {
  const { address: account } = useAccount();

  const [selectedCryptoID, setSelectedCryptoID] = useState("bitcoin");

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

  const fetchPositions = async () => {
    const { data } = await axios.get("http://localhost:3001/positions");
    return data
      .filter(
        (position: Position) =>
          position.token ===
            //@ts-ignore
            cryptosInfo[selectedCryptoID].wrappedTokenZKEvmAddress &&
          position.closed === false &&
          position.liquidated === false
      )
      .map((position: Position) => ({
        id: position.positionId,
        type: position.posType, // Assuming you have this kind of mapping
        collateral: position.collateral * 10 ** 18,
        size: position.size * 10 ** 18,
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

  useEffect(() => {
    refetch();
  }, [selectedCryptoID, refetch]);

  return (
    <div className="flex flex-1 flex-col items-center justify-between p-12">
      <MainTokenInfo
        selectedCryptoID={selectedCryptoID}
        setSelectedCryptoID={setSelectedCryptoID}
      />
      <div className="mt-6 flex w-full flex-1 flex-col items-center justify-start gap-4">
        <div className="flex w-full flex-row justify-start px-6 text-center text-white">
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
              liquidateMode={account !== position.user}
              onComplete={refetch}
            />
          ))}
      </div>
    </div>
  );
};

export default Liquidation;

"use client";

import MainTokenInfo from "@/components/MainTokenInfo";
import OpenPosition from "@/components/OpenPosition";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useState } from "react";

enum Position {
  Long = 0,
  Short = 1,
}

interface LiquidationProps {}

const Liquidation: FC<LiquidationProps> = ({}) => {
  const [selectedCryptoID, setSelectedCryptoID] = useState("ethereum");

  const fetchCryptoInfo = async ({ queryKey }: any) => {
    const { data } = await axios.get(`/api/getInfo/${queryKey[1]}`);
    return data;
  };

  const fetchPositions = async () => {
    const { data } = await axios.get("http://localhost:3001/positions");
    console.log(data);
    return data;
  };

  const { data } = useQuery({
    queryKey: ["cryptoInfo", selectedCryptoID],
    queryFn: fetchCryptoInfo,
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
        <OpenPosition
          type={Position.Long}
          collateral={0.1}
          size={10}
          entryPrice={1800}
          currentPrice={Number(data?.price ?? 0)}
        />
        <OpenPosition
          type={Position.Long}
          collateral={0.5}
          size={10}
          entryPrice={1800}
          currentPrice={Number(data?.price ?? 0)}
        />
        <OpenPosition
          type={Position.Long}
          collateral={0.5}
          size={2}
          entryPrice={1500}
          currentPrice={Number(data?.price ?? 0)}
        />
      </div>
    </div>
  );
};

export default Liquidation;

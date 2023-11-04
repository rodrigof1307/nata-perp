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
  );
};

export default Liquidation;

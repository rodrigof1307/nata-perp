import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SelectToken } from "@/components/SelectToken";
import Box from "@/components/ui/Box";
import { Button } from "./ui/button";
import { useAccount, useBalance, useContractWrite } from "wagmi";
import { cryptosInfo } from "@/lib/cryptosInfo";
import { wrappedABI } from "@/lib/abi";

interface MainTokenInfoProps {
  selectedCryptoID: string;
  setSelectedCryptoID: any;
}

const MainTokenInfo: FC<MainTokenInfoProps> = ({
  selectedCryptoID,
  setSelectedCryptoID,
}) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    // @ts-ignore
    token: cryptosInfo[selectedCryptoID].wrappedTokenZKEvmAddress,
  });

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

  const { write } = useContractWrite({
    //@ts-ignore
    address: cryptosInfo[selectedCryptoID]
      .wrappedTokenZKEvmAddress as `0x${string}`,
    abi: wrappedABI,
    functionName: "mint",
  });

  const handleAirdrop = async () => {
    await write({
      args: [address, 10000000000],
    });
  };

  return (
    <Box className="flex w-full flex-row items-center justify-between rounded-xl p-5">
      <SelectToken onValueChange={setSelectedCryptoID} />
      {data && (
        <>
          <h1 className="font-semibold text-orange-600">
            <span className="mr-1 font-light text-white">Price:</span>
            {" " + data.price + " $"}
          </h1>
          <h1 className="font-semibold text-orange-600">
            <span className="mr-1 font-light text-white">24h Change:</span>
            {data.dailyChange > 0 ? (
              <span className=" text-green-600">{data.dailyChange + "%"}</span>
            ) : (
              <span className="text-red-600">{data.dailyChange + "%"}</span>
            )}
          </h1>
          <h1 className="font-semibold text-orange-600">
            <span className="mr-1 font-light text-white">24h High:</span>
            {" " + data.priceHigh + " $"}
          </h1>
          <h1 className="font-semibold text-orange-600">
            <span className="mr-1 font-light text-white">24h Low:</span>
            {" " + data.priceLow + " $"}
          </h1>
          <h1 className="font-semibold text-orange-600">
            <span className="mr-1 font-light text-white">Balance:</span>
            {" " + balance?.value}
          </h1>
          <Button variant={"full"} onClick={handleAirdrop}>
            Airdrop!
          </Button>
        </>
      )}
    </Box>
  );
};

export default MainTokenInfo;

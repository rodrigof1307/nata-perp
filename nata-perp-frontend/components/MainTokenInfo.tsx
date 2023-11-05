import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SelectToken } from "@/components/SelectToken";
import Box from "@/components/ui/Box";

interface MainTokenInfoProps {
  selectedCryptoID: string;
  setSelectedCryptoID: any;
}

const MainTokenInfo: FC<MainTokenInfoProps> = ({
  selectedCryptoID,
  setSelectedCryptoID,
}) => {
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
    <Box className="flex h-16 w-full flex-row items-center justify-between rounded-xl px-10">
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
        </>
      )}
    </Box>
  );
};

export default MainTokenInfo;

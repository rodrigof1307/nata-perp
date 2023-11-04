"use client";

import { SelectToken } from "@/components/SelectToken";
import Box from "@/components/ui/Box";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useState } from "react";

interface LiquidityPoolProps {}

const LiquidityPool: FC<LiquidityPoolProps> = ({}) => {
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
      <Box className="flex h-16 w-full flex-row items-center justify-between rounded-xl px-10">
        <SelectToken onValueChange={setSelectedCryptoID} />
        {data && (
          <>
            <h1 className="font-semibold text-orange-600">
              {"Price: " + data.price + " $"}
            </h1>
            <h1 className="font-semibold text-orange-600">
              {"24h Change: "}
              {data.dailyChange > 0 ? (
                <span className=" text-green-600">
                  {data.dailyChange + "%"}
                </span>
              ) : (
                <span className="text-red-600">{data.dailyChange + "%"}</span>
              )}
            </h1>
            <h1 className="font-semibold text-orange-600">
              {"24h High: " + data.priceHigh + " $"}
            </h1>
            <h1 className="font-semibold text-orange-600">
              {"24h Low: " + data.priceLow + " $"}
            </h1>
          </>
        )}
      </Box>
      <div className="flex w-full flex-1 flex-row items-stretch justify-between">
        <div className="flex w-1/2 flex-col items-center justify-between pt-8">
          <div className="w-full">
            <h1 className="w-full text-left text-3xl font-semibold text-orange-600">
              Your Liquidity Contribution
            </h1>

            <div className="mt-20 flex w-full flex-col items-center justify-between gap-8">
              <h2 className="w-full text-left text-xl font-light text-orange-600">
                Your Liquidity: 12345 $
              </h2>
              <h2 className="w-full text-left text-xl font-light text-orange-600">
                Your Fees: 12345 $
              </h2>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-start gap-6">
            <Button size={"lg"} className="w-4/5">
              Add Liquidity
            </Button>
            <Button size={"lg"} className="w-4/5">
              Claim fees
            </Button>
            <Button size={"lg"} className="w-4/5">
              Withdrawl Liquidity
            </Button>
          </div>
        </div>
        <div className="flex w-1/2 flex-1 flex-col items-center justify-start pt-8">
          <h1 className="w-full text-left text-3xl font-semibold text-orange-600">
            Liquidity Pool Distribution
          </h1>
          <div className="mt-20 flex w-full flex-col items-center justify-between gap-8">
            <h2 className="w-full text-left text-xl font-light text-orange-600">
              Total Pool Size: 12345 $
            </h2>
            <h2 className="w-full text-left text-xl font-light text-orange-600">
              Open Interest: 12345 $
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityPool;

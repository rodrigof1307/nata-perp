"use client";

import MainTokenInfo from "@/components/MainTokenInfo";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";

interface LiquidityPoolProps {}

const LiquidityPool: FC<LiquidityPoolProps> = ({}) => {
  const [selectedCryptoID, setSelectedCryptoID] = useState("ethereum");

  return (
    <div className="flex flex-1 flex-col items-center justify-between p-12">
      <MainTokenInfo
        selectedCryptoID={selectedCryptoID}
        setSelectedCryptoID={setSelectedCryptoID}
      />
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

"use client";

import MainTokenInfo from "@/components/MainTokenInfo";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { cryptosInfo } from "@/lib/cryptosInfo";
import { usePerpContractWrite } from "@/hooks/usePerpContractWrite";
import { Input } from "@/components/ui/input";

interface LiquidityPoolProps {}

const LiquidityPool: FC<LiquidityPoolProps> = ({}) => {
  const [selectedCryptoID, setSelectedCryptoID] = useState("ethereum");
  const chainID = useChainId();
  const [tokenAddress, setTokenAddress] = useState("");
  const [additionAmount, setAdditionAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  useEffect(() => {
    switch (chainID) {
      case 1442:
        // @ts-ignore
        setTokenAddress(cryptosInfo[selectedCryptoID].wrappedTokenZKEvmAddress);
      case 10200:
        // @ts-ignore
        setTokenAddress(cryptosInfo[selectedCryptoID].wrappedTokenZKEvmAddress);
    }
  }, [chainID, selectedCryptoID]);

  const { write: writeAddLiquidity } = usePerpContractWrite({
    functionName: "addLiquidity",
    selectedCryptoID,
  });

  const { write: writeWithdrawLiquidity } = usePerpContractWrite({
    functionName: "withdrawLiquidity",
    selectedCryptoID,
  });

  const { write: writeClaimFees } = usePerpContractWrite({
    functionName: "claimFees",
    selectedCryptoID,
  });

  const addLiquidity = async () => {
    console.log(tokenAddress);
    console.log(additionAmount);
    const response = await writeAddLiquidity({
      args: [tokenAddress, additionAmount],
    });
    console.log(response);
  };

  const withdrawLiquidity = async () => {
    console.log(tokenAddress);
    console.log(withdrawAmount);
    const response = await writeWithdrawLiquidity({
      args: [tokenAddress, withdrawAmount],
    });
    console.log(response);
  };

  const claimFees = async () => {
    const response = await writeClaimFees({
      args: [tokenAddress],
    });
    console.log(response);
  };

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
            <div className="flex w-full flex-row items-center justify-between gap-4">
              <Input
                placeholder="Amount"
                className="h-16 w-36 border-2"
                onChange={(event) => {
                  setAdditionAmount(Number(event.target.value) ?? 0);
                }}
              />
              <Button size={"lg"} className="flex-1" onClick={addLiquidity}>
                Add Liquidity
              </Button>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-4">
              <Input
                onChange={(event) => {
                  setWithdrawAmount(Number(event.target.value) ?? 0);
                }}
                placeholder="Amount"
                className="h-16 w-36 border-2"
              />
              <Button
                size={"lg"}
                className="flex-1"
                onClick={withdrawLiquidity}
              >
                Withdrawl Liquidity
              </Button>
            </div>
            <Button size={"lg"} className="w-full" onClick={claimFees}>
              Claim fees
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

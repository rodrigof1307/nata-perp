"use client";

import MainTokenInfo from "@/components/MainTokenInfo";
import { Button } from "@/components/ui/button";
import { FC, useCallback, useEffect, useState } from "react";
import {
  erc20ABI,
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { cryptosInfo } from "@/lib/cryptosInfo";
import { usePerpContractWrite } from "@/hooks/usePerpContractWrite";
import { Input } from "@/components/ui/input";
import { createPublicClient, http } from "viem";
import { gnosis, polygonZkEvmTestnet } from "viem/chains";
import { perpABI } from "@/lib/abi";

interface LiquidityPoolProps {}

const LiquidityPool: FC<LiquidityPoolProps> = ({}) => {
  const [selectedCryptoID, setSelectedCryptoID] = useState("bitcoin");
  const chainID = useChainId();
  const [tokenAddress, setTokenAddress] = useState("");
  const [additionAmount, setAdditionAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [perpAddress, setPerpAddress] = useState("");
  const [publicClient, setPublicClient] = useState<any>();
  const [userFees, setUserFees] = useState(0);
  const { address: userAddress } = useAccount();

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

  const { data: fees, refetch: refetchFees } = useContractRead({
    address: perpAddress as `0x${string}`,
    abi: perpABI,
    functionName: "fees",
    args: [tokenAddress],
  });

  const { data: tokenLiquidity, refetch: refetchTokenLiquidity } =
    useContractRead({
      address: perpAddress as `0x${string}`,
      abi: perpABI,
      functionName: "getTokenLiquidity",
      args: [tokenAddress],
    });

  const { data: userTokenLiquidity, refetch: refetchUserTokenLiquidity } =
    useContractRead({
      address: perpAddress as `0x${string}`,
      abi: perpABI,
      functionName: "getUserTokenLiquidity",
      args: [userAddress, tokenAddress],
    });

  useEffect(() => {
    console.log("tokenAddress should work ", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    console.log("tokenLiquidity ", tokenLiquidity);
  }, [tokenLiquidity]);

  const { writeAsync: writeRequestApproval } = useContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: "approve",
  });

  const { writeAsync: writeAddLiquidity } = usePerpContractWrite({
    functionName: "depositLiquidity",
    selectedCryptoID,
  });

  const { writeAsync: writeWithdrawLiquidity } = usePerpContractWrite({
    functionName: "withdrawLiquidity",
    selectedCryptoID,
  });

  const { writeAsync: writeClaimFees } = usePerpContractWrite({
    functionName: "claimFees",
    selectedCryptoID,
  });

  const addLiquidity = async () => {
    const response1 = await writeRequestApproval({
      args: [perpAddress as `0x${string}`, BigInt(additionAmount)],
    });

    await publicClient.waitForTransactionReceipt({
      hash: response1.hash,
    });

    const response2 = await writeAddLiquidity({
      args: [tokenAddress, BigInt(additionAmount)],
    });

    await publicClient.waitForTransactionReceipt({
      hash: response2.hash,
    });

    await generalRefetch();
  };

  const withdrawLiquidity = async () => {
    const response = await writeWithdrawLiquidity({
      args: [tokenAddress, BigInt(withdrawAmount)],
    });

    await publicClient.waitForTransactionReceipt({
      hash: response.hash,
    });

    await generalRefetch();
  };

  const claimFees = async () => {
    const response = await writeClaimFees({
      args: [tokenAddress],
    });

    await publicClient.waitForTransactionReceipt({
      hash: response.hash,
    });

    await generalRefetch();
  };

  const generalRefetch = useCallback(async () => {
    await Promise.all([refetchTokenLiquidity(), refetchUserTokenLiquidity()]);
  }, [refetchTokenLiquidity, refetchUserTokenLiquidity]);

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

    generalRefetch().then(() => console.log("finished refetching"));
  }, [chainID, generalRefetch, selectedCryptoID, userAddress]);

  useEffect(() => {
    if (!fees || !userTokenLiquidity || !tokenLiquidity) {
      setUserFees(0);
    } else {
      setUserFees(
        (userTokenLiquidity as any) * ((fees as any) / (tokenLiquidity as any))
      );
    }
  }, [fees, tokenLiquidity, userTokenLiquidity]);

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
                {`Your Liquidity Contribution: ${userTokenLiquidity}`}
              </h2>
              <h2 className="w-full text-left text-xl font-light text-orange-600">
                {`Your Fees: ${userFees.toFixed(2)}`}
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
                Withdraw Liquidity
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
              {`Total Pool Liquidity: ${(tokenLiquidity as any)?.total ?? 0}`}
            </h2>
            <h2 className="w-full text-left text-xl font-light text-orange-600">
              {`Open Interest: ${(tokenLiquidity as any)?.openInterest ?? 0}`}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityPool;

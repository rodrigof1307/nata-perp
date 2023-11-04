import { useChainId, useContractWrite } from "wagmi";
import { perpABI } from "../lib/abi";
import { useState, useEffect } from "react";

export const usePerpContractWrite = ({
  functionName,
  selectedCryptoID,
}: {
  functionName: string;
  selectedCryptoID: string;
}) => {
  const chainID = useChainId();
  const [perpAddress, setPerpAddress] = useState("");

  useEffect(() => {
    switch (chainID) {
      case 1442:
        setPerpAddress(process.env.NEXT_PUBLIC_PERP_ADDRESS_ZK_EVM!);
        break;
      case 10200:
        setPerpAddress(process.env.NEXT_PUBLIC_PERP_ADDRESS_GNOSIS!);
        break;
    }
  }, [chainID, selectedCryptoID]);

  return useContractWrite({
    address: perpAddress as `0x${string}`,
    abi: perpABI,
    functionName,
  });
};

import React, { createContext, useContext, useState } from "react";
import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";

const Web3AuthModalPackContext = createContext<any>(undefined);

export const Web3AuthModalPackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [web3AuthModalPack, setWeb3AuthModalPack] = useState<
    Web3AuthModalPack | undefined
  >(undefined);

  return (
    <Web3AuthModalPackContext.Provider
      value={{ web3AuthModalPack, setWeb3AuthModalPack }}
    >
      {children}
    </Web3AuthModalPackContext.Provider>
  );
};

export const useWeb3AuthModalPack = () => {
  const context = useContext(Web3AuthModalPackContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

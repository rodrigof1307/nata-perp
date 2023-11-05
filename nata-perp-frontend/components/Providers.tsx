"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { useState } from "react";

import { WagmiConfig as WagmiConfigOriginal, configureChains } from "wagmi";
import {
  mainnet,
  sepolia,
  gnosisChiado,
  polygonZkEvmTestnet,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { Web3AuthModalPackProvider } from "@/context/useWeb3AuthModalPackContext";

const wagmiMetadata = {
  title: "Nata Perp",
  description: "ETH Lisbon Hackathon Project",
};

const { chains } = configureChains(
  [polygonZkEvmTestnet, gnosisChiado],
  [publicProvider()]
);

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  metadata: wagmiMetadata,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains,
  themeVariables: {
    "--w3m-font-family": "__Sora_2dafea, __Sora_Fallback_2dafea",
    "--w3m-accent": "#ea580c",
    "--w3m-font-size-master": "12px",
    "--w3m-border-radius-master": "2px",
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(new QueryClient());

  return (
    <Web3AuthModalPackProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiConfigOriginal config={wagmiConfig}>
          {children}
        </WagmiConfigOriginal>
      </QueryClientProvider>
    </Web3AuthModalPackProvider>
  );
}

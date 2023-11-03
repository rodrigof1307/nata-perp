"use client";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import {
  WagmiConfig as WagmiConfigOriginal,
  configureChains,
  createConfig,
} from "wagmi";
import { sepolia, zkSyncTestnet, gnosisChiado } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// 1. Get projectId
const projectId = "5a7ce9e60e8ebeabb85f1fa0fe29a3c2";

// 2. Create wagmiConfig
const wagmiMetadata = {
  title: "Trading Perp",
  description: "ETH Lisbon Hackathon Project",
};

const { chains } = configureChains(
  [sepolia, zkSyncTestnet, gnosisChiado],
  [publicProvider()]
);

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: wagmiMetadata,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    "--w3m-font-family": "__Sora_2dafea, __Sora_Fallback_2dafea",
    "--w3m-accent": "#ea580c",
    "--w3m-font-size-master": "12px",
    "--w3m-border-radius-master": "2px",
  },
});

export default function WagmiConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfigOriginal config={wagmiConfig}>{children}</WagmiConfigOriginal>
  );
}

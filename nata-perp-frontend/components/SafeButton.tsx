import { FC, useEffect, useState } from "react";

import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Button } from "./ui/button";
import { useWeb3AuthModalPack } from "@/context/useWeb3AuthModalPackContext";
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";

import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";

interface SafeButtonProps {}

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId:
    "BOoQgmU9DieCatx18Epy-MZriBP3935zN3_osjGqwaqhPElBFqeWjrg--T0ybB7fmTj_-G3S84Omnr6sCASibvM", // https://dashboard.web3auth.io/
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x5a2",
    // https://chainlist.org/
    rpcTarget: "https://rpc.public.zkevm-test.net",
  },
  uiConfig: {
    theme: "dark",
    defaultLanguage: "en",
    loginMethodsOrder: ["discord"],
  },
};

// https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "none",
  },
  adapterSettings: {
    uxMode: "popup",
    whiteLabel: {
      name: "Safe",
    },
  },
});

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: "https://safe-transaction-goerli.safe.global",
};

const SafeButton: FC<SafeButtonProps> = ({}) => {
  const { web3AuthModalPack, setWeb3AuthModalPack } = useWeb3AuthModalPack();

  const unwrappedWeb3AuthModalPack = async () => {
    if (web3AuthModalPack) {
      return web3AuthModalPack;
    }

    const web3AuthModalPackInit = new Web3AuthModalPack(web3AuthConfig);
    await web3AuthModalPackInit.init({
      options,
      adapters: [openloginAdapter],
    });
    const providerOG = (web3AuthModalPack as Web3AuthModalPack).getProvider()!;
    const provider = new ethers.providers.Web3Provider(
      web3AuthModalPack.providerOG
    );
    const signer = provider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer || provider,
    });

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const owners = [
      "0x65D9FC9BfB33934A3c118889BC5CCB86262C64d7",
      "0x5f2f18d860896916DE68b138645b711d73a3D80B",
    ];
    const threshold = 1;
    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };
    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
    const newSafeAddress = await safeSdk.getAddress();

    setWeb3AuthModalPack(web3AuthModalPackInit);

    return web3AuthModalPackInit;
  };

  const onClick = async () => {
    const web3AuthModalPack = await unwrappedWeb3AuthModalPack();

    const response1 = await web3AuthModalPack.signIn();
    console.log(response1);

    const response2 = await web3AuthModalPack.getProvider();
    console.log(response2);

    // const response3 = await web3AuthModalPack.signOut();
    // console.log(response3);
  };

  return (
    <Button
      variant={"full"}
      className="h-[45px] rounded-[16px] text-[20px]"
      onClick={onClick}
    >
      Safe Connect
    </Button>
  );
};

export default SafeButton;

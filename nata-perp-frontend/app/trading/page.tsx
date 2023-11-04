"use client";

import { FC, useState } from "react";
import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from "@web3inbox/widget-react";
import { useSignMessage, useAccount, useChainId } from "wagmi";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainTokenInfo from "@/components/MainTokenInfo";
import Chart from "@/components/Chart";
import Box from "@/components/ui/Box";

interface TradingProps {}

const Trading: FC<TradingProps> = ({}) => {
  const [selectedCryptoID, setSelectedCryptoID] = useState("ethereum");

  return (
    <div className="flex flex-1 flex-col items-center justify-between p-12">
      <MainTokenInfo
        selectedCryptoID={selectedCryptoID}
        setSelectedCryptoID={setSelectedCryptoID}
      />
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <Chart selectedCryptoID={selectedCryptoID} />
        <Box className="h-[550px] w-[350px]">
          <h1>Teste</h1>
        </Box>
      </div>
    </div>
  );

  // const { address } = useAccount();
  // const chainId = useChainId();
  // const { signMessageAsync } = useSignMessage();
  // const isReady = useInitWeb3InboxClient({
  //   projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  //   domain: process.env.NEXT_PUBLIC_DOMAIN ?? "",
  //   isLimited: false,
  // });
  // const { setAccount, isRegistered, isRegistering, register } = useW3iAccount();
  // useEffect(() => {
  //   if (!address) return;
  //   setAccount(`eip155:${chainId}:${address}`);
  // }, [address, setAccount, chainId]);
  // const performRegistration = useCallback(async () => {
  //   if (!address) return;
  //   try {
  //     await register((message) => signMessageAsync({ message }));
  //   } catch (registerIdentityError) {
  //     alert(registerIdentityError);
  //   }
  // }, [signMessageAsync, register, address]);
  // useEffect(() => {
  //   performRegistration();
  // }, [performRegistration]);
  // const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();
  // const performSubscribe = useCallback(async () => {
  //   const response1 = await performRegistration();
  //   const response2 = await subscribe();
  // }, [subscribe, performRegistration]);
  // const { subscription } = useSubscription();
  // const { messages } = useMessages();
  // const notificationClick = async () => {
  //   await fetch(
  //     `https://notify.walletconnect.com/${
  //       process.env.NEXT_PUBLIC_PROJECT_ID ?? ""
  //     }/notify`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTIFY ?? ""}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         notification: {
  //           type: "0de41dc4-845a-4f70-b420-809cc832d71e", // Notification type ID copied from Cloud
  //           title: "Rodrigo your position is open",
  //           body: "Notification test",
  //         },
  //         accounts: [
  //           `eip155:${chainId}:${address}`, // CAIP-10 account ID
  //         ],
  //       }),
  //     }
  //   );
  // };
  // return (
  //   <div className="flex flex-col items-center justify-center font-semibold text-orange-500">
  //     <h1>Trading page</h1>
  //     {!isRegistered ? (
  //       <Button onClick={performRegistration} disabled={isRegistering}>
  //         {isRegistering ? "Signing..." : "Sign"}
  //       </Button>
  //     ) : (
  //       <>
  //         {!isSubscribed ? (
  //           <>
  //             <Button onClick={performSubscribe} disabled={isSubscribing}>
  //               {isSubscribing
  //                 ? "Subscribing..."
  //                 : "Subscribe to notifications"}
  //             </Button>
  //           </>
  //         ) : (
  //           <div className="w-4/5">
  //             <div>You are subscribed</div>
  //             <div>Subscription: {JSON.stringify(subscription)}</div>
  //             <div>
  //               Messages:{" "}
  //               {JSON.stringify(messages.map((message) => message.message))}
  //             </div>
  //             <Button onClick={notificationClick}>
  //               Send me a notification
  //             </Button>
  //           </div>
  //         )}
  //       </>
  //     )}
  //   </div>
  // );
};

export default Trading;

"use client";

import { FC } from "react";
import {
  useManageSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from "@web3inbox/widget-react";
import { useSignMessage, useAccount, useChainId } from "wagmi";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Box from "@/components/ui/Box";

const Notifications: FC = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const isReady = useInitWeb3InboxClient({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
    domain: process.env.NEXT_PUBLIC_DOMAIN ?? "",
    isLimited: false,
  });
  const { setAccount, isRegistered, isRegistering, register } = useW3iAccount();

  useEffect(() => {
    if (!address) return;
    setAccount(`eip155:${chainId}:${address}`);
  }, [address, setAccount, chainId]);

  const performRegistration = useCallback(async () => {
    if (!address) return;
    try {
      await register((message) => signMessageAsync({ message }));
    } catch (registerIdentityError) {
      alert(registerIdentityError);
    }
  }, [signMessageAsync, register, address]);

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();

  const performSubscribe = useCallback(async () => {
    const response1 = await performRegistration();
    const response2 = await subscribe();
  }, [subscribe, performRegistration]);

  const { messages } = useMessages(
    `eip155:${chainId}:${"0x1Cd5956d6BDb1692e92113A3F2130435333e178D"}`
  );

  if (!isReady) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 font-semibold text-orange-500">
        <div className="h-40 w-40 animate-pulse rounded-full bg-orange-600 p-1" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-12 font-semibold text-orange-500">
      {!isRegistered || !isSubscribed ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Button
            variant={"full"}
            size={"lg"}
            onClick={performSubscribe}
            disabled={isSubscribing}
          >
            {isSubscribing ? "Subscribing..." : "Subscribe to notifications"}
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col items-center justify-start gap-4">
          <h2 className="mb-2 w-full text-left text-2xl text-white">
            Trade Feed
          </h2>
          {messages
            .sort((a, b) => b.publishedAt - a.publishedAt)
            .map((message) => (
              <Box key={message.id} className="w-full p-4">
                <div className="flex flex-row items-center justify-between">
                  <h1 className="text-lg">{message.message.title}</h1>
                  <p className="font-light text-white">
                    {new Date(message.publishedAt).toLocaleString()}
                  </p>
                </div>
                <h3 className="font-light text-white">
                  {message.message.body}
                </h3>
              </Box>
            ))}
        </div>
      )}
    </div>
  );
};
export default Notifications;

import { ConnectButton } from "@xellar/kit";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const AuthConnectButton = (props: { className?: string }) => {
  const { signInWithXellar } = useAuth();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      // Attempt to authenticate when wallet is connected
      signInWithXellar().catch(console.error);
    }
  }, [isConnected, signInWithXellar]);

  return <ConnectButton {...props} />;
};

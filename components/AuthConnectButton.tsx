import { ConnectButton } from "@xellar/kit";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const AuthConnectButton = (props: { className?: string }) => {
  const { signInWithXellar } = useAuth();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    console.debug("AuthConnectButton mounted, wallet status:", {
      isConnected,
      address,
    });

    if (isConnected) {
      console.debug("Wallet connected, triggering signInWithXellar...");
      signInWithXellar().catch((err) =>
        console.error("signInWithXellar error:", err)
      );
    }
  }, [isConnected, signInWithXellar]);

  return <ConnectButton {...props} />;
};

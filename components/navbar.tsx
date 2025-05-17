"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AuthConnectButton } from "@/components/AuthConnectButton";
import { useAccount, useReadContract } from "wagmi";
import { formatCustomNumber } from "@/utils/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Mint", href: "/mint" },
  { label: "Stake", href: "/stake" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [balanceIdr, setBalanceIdr] = useState(0);

  const {
    data: idrxBalance,
    error,
    isLoading,
  } = useReadContract({
    address: "0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661",
    abi: [
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  useEffect(() => {
    if (idrxBalance) {
      setBalanceIdr(Number(idrxBalance));
    }

    if (error) {
      console.log("Error fetching IDRX balance:", error);
    }

    if (isLoading) {
      console.log("Fetching IDRX balance...");
    }
  }, [idrxBalance, error, isLoading]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/20 bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">EVERA</span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-400",
                pathname === item.href ? "text-purple-400" : "text-gray-300"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mx-2 px-4 py-2.5 bg-white font-semibold rounded-lg text-sm text-gray-800">
          {formatCustomNumber(balanceIdr)} IDRX
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <AuthConnectButton className="hidden md:flex" />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-purple-800 bg-black/95"
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">EVERA</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-purple-400",
                      pathname === item.href
                        ? "text-purple-400"
                        : "text-gray-300"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <AuthConnectButton className="mt-4" />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Info,
  Shield,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { mockAssets } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TransactionSuccess } from "@/components/transaction-success";
import { useWaitForTransactionReceipt, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
// import { launchpadAbi } from "@/services/abi";

export default function AssetDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [buyAmount, setBuyAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStakingSuccess, setIsStakingSuccess] = useState(false);
  // const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const [buyTxHash, setBuyTxHash] = useState<`0x${string}` | undefined>();

  // In a real app, you would fetch this data from an API
  const asset = mockAssets.find((a) => a.id === id) || mockAssets[0];

  // Contract configuration
  const launchpadAddress = process.env.NEXT_PUBLIC_CONTRACT_RWA_LAUNCHPAD;

  // Get token address from launchpad contract
  // const { data: tokenAddress } = useReadContract({
  //   address: launchpadAddress as `0x${string}`,
  //   abi: launchpadAbi,
  //   functionName: "getRWATokenAtIndex",
  //   args: [BigInt(Number(id))],
  // });

  const handleBuy = async () => {
    // Validate input
    if (!buyAmount || Number(buyAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to buy",
        variant: "destructive",
      });
      return;
    }

    if (!launchpadAddress) {
      toast({
        title: "Error",
        description: "Launchpad address not configured",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert amount to wei
      const amountInWei = parseEther(buyAmount);

      console.log(`Sending ${amountInWei} wei to ${launchpadAddress}`);

      // Simple ETH transfer to launchpad address - no contract function call
      const tx = await sendTransactionAsync({
        to: launchpadAddress as `0x${string}`,
        value: amountInWei,
      });

      toast({
        title: "Transaction submitted",
        description: "Your ETH has been sent",
      });

      setBuyTxHash(tx);
    } catch (error) {
      console.error("Buy error:", error);

      // More specific error handling
      let errorMessage = "There was an error processing your purchase";

      // Check for common errors
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Transaction failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const { isLoading: isBuyLoading, isSuccess: isBuySuccess } =
    useWaitForTransactionReceipt({
      hash: buyTxHash,
    });

  // Show success message when transaction is confirmed
  useEffect(() => {
    if (isBuySuccess) {
      toast({
        title: "Purchase successful!",
        description: `You have purchased ${buyAmount} ${asset.symbol}`,
      });
      setBuyAmount("");
    }
  }, [isBuySuccess, buyAmount, asset.symbol, toast]);

  const handleStake = () => {
    // In a real app, this would call an API to stake the tokens
    console.log("Staking tokens:", stakeAmount);

    // Show success state
    setIsStakingSuccess(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsStakingSuccess(false);
      toast({
        title: "Staking successful!",
        description: `You have staked ${stakeAmount} ${asset.symbol}`,
      });
    }, 3000);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/explore" className="hover:text-purple-400">
                Explore
              </Link>
              <span>/</span>
              <span>{asset.type}</span>
              <span>/</span>
              <span className="text-white">{asset.name}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white">{asset.name}</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-400">
                <Building className="h-4 w-4" />
                <span>{asset.institution}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl border border-purple-800 bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
            <div className="aspect-video bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center">
              <div className="text-4xl font-bold text-white">
                {asset.symbol}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="w-full border-b border-gray-800 bg-transparent">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="stakers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Stakers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Description
                  </h2>
                  <p className="text-gray-400">{asset.description}</p>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Asset Details
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Total Supply</div>
                      <div className="text-lg font-medium text-white">
                        {asset.totalSupply.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">
                        Price per Token
                      </div>
                      <div className="text-lg font-medium text-white">
                        ${asset.priceUsd.toFixed(2)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Total Staked</div>
                      <div className="text-lg font-medium text-white">
                        {asset.stakedAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Annual Yield</div>
                      <div className="text-lg font-medium text-white">
                        {asset.annualYield}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="pt-6">
              <div className="space-y-4">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Official Documents
                </h2>

                {asset.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-800 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <div>
                        <div className="font-medium text-white">{doc.name}</div>
                        <div className="text-sm text-gray-400">
                          Added on {new Date(doc.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-800"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="stakers" className="pt-6">
              <div className="space-y-4">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Top Stakers
                </h2>

                <div className="space-y-4">
                  {asset.topStakers.map((staker, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-800 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900 text-white">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {staker.address.slice(0, 6)}...
                            {staker.address.slice(-4)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {staker.amount.toLocaleString()} ETH
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          $
                          {(staker.amount * asset.priceUsd).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {((staker.amount / asset.stakedAmount) * 100).toFixed(
                            2
                          )}
                          % of total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Buy Tokens</CardTitle>
              <CardDescription>Invest in this asset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Price per Token</span>
                  <span className="font-medium text-white">
                    ${asset.priceUsd.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Available</span>
                  <span className="font-medium text-white">
                    {(asset.totalSupply - asset.stakedAmount).toLocaleString()}{" "}
                    {asset.symbol}
                  </span>
                </div>
                <Separator className="my-2 bg-gray-800" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Minimum Purchase
                  </span>
                  <span className="font-medium text-white">
                    10 {asset.symbol}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyAmount" className="text-white">
                    Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="buyAmount"
                      type="number"
                      placeholder="0"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="pr-16 border-purple-800 bg-black/60 text-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-gray-400">ETH</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-purple-900/20 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Total</span>
                    <span className="font-medium text-white">
                      $
                      {buyAmount
                        ? (
                            Number.parseFloat(buyAmount) * asset.priceUsd
                          ).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      Buy Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-purple-800 bg-black/95">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Confirm Purchase
                      </DialogTitle>
                      <DialogDescription>
                        You are about to purchase {asset.symbol} tokens from{" "}
                        {asset.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Amount</span>
                        <span className="font-medium text-white">
                          {buyAmount || "0"} {asset.symbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Price per Token</span>
                        <span className="font-medium text-white">
                          ${asset.priceUsd.toFixed(2)}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total</span>
                        <span className="text-lg font-bold text-white">
                          $
                          {buyAmount
                            ? (
                                Number.parseFloat(buyAmount) * asset.priceUsd
                              ).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {}}
                        variant="outline"
                        className="border-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                        onClick={handleBuy}
                        disabled={isBuyLoading}
                      >
                        {isBuyLoading ? "Processing..." : "Confirm Purchase"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-800 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-white">Stake Tokens</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80">
                        Staking tokens helps validate the asset and provides you
                        with annual yield
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>
                Earn {asset.annualYield}% annual yield
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Staked</span>
                    <span className="font-medium text-white">
                      {asset.stakedAmount.toLocaleString()} {asset.symbol}
                    </span>
                  </div>
                  <Progress
                    value={(asset.stakedAmount / asset.totalSupply) * 100}
                    className="h-2 bg-gray-800"
                  />
                  <div className="mt-1 text-right text-xs text-gray-400">
                    {((asset.stakedAmount / asset.totalSupply) * 100).toFixed(
                      2
                    )}
                    % of total supply
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-cyan-900/20 p-3">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-gray-300">
                    {asset.stakedAmount > asset.totalSupply * 0.5
                      ? "This asset has a high trust level"
                      : "This asset is in the validation process"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stakeAmount" className="text-white">
                    Stake Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="stakeAmount"
                      type="number"
                      placeholder="0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="pr-16 border-cyan-800 bg-black/60 text-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-gray-400">ETH</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-cyan-900/20 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Estimated Annual Yield
                    </span>
                    <span className="font-medium text-white">
                      {stakeAmount
                        ? (
                            (Number.parseFloat(stakeAmount) *
                              asset.priceUsd *
                              asset.annualYield) /
                            100
                          ).toFixed(2)
                        : "0.00"}{" "}
                      USD
                    </span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                      Stake Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-cyan-800 bg-black/95">
                    {isStakingSuccess ? (
                      <TransactionSuccess
                        message="Staking Successful!"
                        subMessage={`You have staked ${stakeAmount} ${asset.symbol}`}
                        onComplete={() => setIsStakingSuccess(false)}
                      />
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Confirm Staking
                          </DialogTitle>
                          <DialogDescription>
                            You are about to stake {asset.symbol} tokens to
                            validate this asset
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Amount</span>
                            <span className="font-medium text-white">
                              {stakeAmount || "0"} {asset.symbol}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Annual Yield</span>
                            <span className="font-medium text-green-400">
                              {asset.annualYield}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Lock Period</span>
                            <span className="font-medium text-white">
                              30 days
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              Estimated Monthly Rewards
                            </span>
                            <span className="text-lg font-bold text-white">
                              {stakeAmount
                                ? (
                                    (Number.parseFloat(stakeAmount) *
                                      asset.priceUsd *
                                      asset.annualYield) /
                                    100 /
                                    12
                                  ).toFixed(2)
                                : "0.00"}{" "}
                              USD
                            </span>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" className="border-gray-700">
                            Cancel
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                            onClick={handleStake}
                          >
                            Confirm Staking
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400">Contract Address</div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm text-white">
                      {asset.contractAddress.slice(0, 18)}...
                      {asset.contractAddress.slice(-4)}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Blockchain</div>
                  <div className="text-white">{asset.blockchain}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Tokenization Date</div>
                  <div className="text-white">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Clock, Shield, TrendingUp } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
import { mockAssets } from "@/lib/mock-data";
import { AssetCard } from "@/components/asset-card";
// import { useToast } from "@/hooks/use-toast";

export default function StakePage() {
  // const { toast } = useToast();
  // const [stakeAmount, setStakeAmount] = useState("");

  // Filter assets with highest yield
  const highYieldAssets = [...mockAssets]
    .sort((a, b) => b.annualYield - a.annualYield)
    .slice(0, 3);

  // Filter assets with lowest validation (staked amount)
  const needsValidationAssets = [...mockAssets]
    .sort(
      (a, b) => a.stakedAmount / a.totalSupply - b.stakedAmount / b.totalSupply
    )
    .slice(0, 3);

  // const handleStake = () => {
  //   toast({
  //     title: "Staking successful!",
  //     description: "You have successfully staked to AVS Eigenlayer",
  //   });
  // };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          AVS Eigenlayer Staking
        </h1>
        <p className="mt-2 mx-auto max-w-2xl text-gray-400">
          Stake your tokens to AVS Eigenlayer to validate real-world assets and
          earn rewards
        </p>
      </div>

      <div className="grid gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8 rounded-xl border border-purple-800 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900">
                <Shield className="h-6 w-6 text-purple-300" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">
                  What is AVS Eigenlayer?
                </h2>
                <p className="mt-1 text-gray-400">
                  AVS (Actively Validated Services) Eigenlayer is a system that
                  enables validation of real-world assets through staking. The
                  more tokens staked on an asset, the higher the trust level for
                  that asset.
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="high-yield" className="mb-8">
            <TabsList className="w-full border-b border-gray-800 bg-transparent">
              <TabsTrigger
                value="high-yield"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Highest Yield
              </TabsTrigger>
              <TabsTrigger
                value="needs-validation"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Needs Validation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="high-yield" className="pt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Assets with Highest Yield
                </h2>
                <p className="text-gray-400">
                  Stake on these assets to earn the highest annual yield
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {highYieldAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="needs-validation" className="pt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Assets Needing Validation
                </h2>
                <p className="text-gray-400">
                  These assets need more staking to increase trust
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {needsValidationAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="rounded-xl border border-cyan-800 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Staking Benefits
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-900">
                  <TrendingUp className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="font-medium text-white">Earn Yield</h3>
                <p className="text-sm text-gray-400">
                  Receive annual yield from assets you validate through staking
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-900">
                  <Shield className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="font-medium text-white">Increase Trust</h3>
                <p className="text-sm text-gray-400">
                  Help increase trust in tokenized real-world assets
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-900">
                  <Clock className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="font-medium text-white">Priority Access</h3>
                <p className="text-sm text-gray-400">
                  Get priority access to new assets being tokenized
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* <Card className="border-purple-800 bg-black/60 backdrop-blur-sm sticky top-4">
            <CardHeader>
              <CardTitle className="text-white">Stake to AVS Eigenlayer</CardTitle>
              <CardDescription>Validate assets and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Staked on Platform</span>
                    <span className="font-medium text-white">5,245,890 EVERA</span>
                  </div>
                  <Progress value={65} className="h-2 bg-gray-800" />
                </div>

                <div className="rounded-lg bg-purple-900/20 p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-gray-300">Average annual yield: 8.5%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stakeAmount" className="text-white">Stake Amount</Label>
                  <div className="relative">
                    <Input
                      id="stakeAmount"
                      type="number"
                      placeholder="0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="pr-16 border-purple-800 bg-black/60"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-gray-400">ETH</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg bg-gray-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Lock Period</span>
                    <span className="text-white">30 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Estimated APY</span>
                    <span className="text-white">8.5%</span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Estimated Reward</span>
                    <span className="font-medium text-white">
                      {stakeAmount ? ((Number.parseFloat(stakeAmount) * 0.085) / 12).toFixed(2) : "0.00"} EVERA/month
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  onClick={handleStake}
                >
                  Stake Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-gray-500">
                  By staking, you agree to lock your tokens for a minimum of 30 days. Rewards will be distributed at the
                  end of each month.
                </p>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}

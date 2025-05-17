/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building, Calendar, Clock, ExternalLink, Shield, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"
import { mockAssets } from "@/lib/mock-data"
import { mockUserData } from "@/lib/user-data"
import { AssetActivityList } from "@/components/asset-activity-list"
import { NotificationList } from "@/components/notification-list"
import { WalletConnect } from "@/components/wallet-connect"
import { StakingRewards } from "@/components/staking-reward"
import { PortfolioValue } from "@/components/portofolio-value"
import { PortfolioChart } from "@/components/charts/portfolio-chart"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { TransactionSuccess } from "@/components/transaction-success"

export default function DashboardPage() {
    const [isWalletConnected, setIsWalletConnected] = useState(true)
    const [isClaimingSuccess, setIsClaimingSuccess] = useState(false)
    const { toast } = useToast()

    // Filter user's owned assets
    const ownedAssets = mockAssets
        .filter((asset) => mockUserData.ownedAssets.some((owned) => owned.assetId === asset.id))
        .map((asset) => {
            const ownedData = mockUserData.ownedAssets.find((owned) => owned.assetId === asset.id)
            return {
                ...asset,
                ownedAmount: ownedData?.amount || 0,
                purchaseDate: ownedData?.purchaseDate || "",
            }
        })

    // Filter user's staked assets
    const stakedAssets = mockAssets
        .filter((asset) => mockUserData.stakedAssets.some((staked) => staked.assetId === asset.id))
        .map((asset) => {
            const stakedData = mockUserData.stakedAssets.find((staked) => staked.assetId === asset.id)
            return {
                ...asset,
                stakedAmount: stakedData?.amount || 0,
                stakeDate: stakedData?.stakeDate || "",
                claimableRewards: stakedData?.claimableRewards || 0,
            }
        })

    if (!isWalletConnected) {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Wallet className="mb-4 h-12 w-12 text-gray-400" />
                    <h1 className="mb-2 text-2xl font-bold text-white">Connect Your Wallet</h1>
                    <p className="mb-6 max-w-md text-gray-400">
                        Connect your wallet to access your dashboard and manage your assets
                    </p>
                    <WalletConnect onConnect={() => setIsWalletConnected(true)} />
                </div>
            </div>
        )
    }

    const handleClaimRewards = (asset: any) => {
        // In a real app, this would call an API to claim rewards
        console.log("Claiming rewards")

        // Show success state
        setIsClaimingSuccess(true)

        // Reset after 3 seconds and show toast
        setTimeout(() => {
            setIsClaimingSuccess(false)
            toast({
                title: "Rewards Claimed!",
                description: `You have claimed ${asset.claimableRewards.toFixed(2)} ${asset.symbol} tokens`,
            })
        }, 3000)
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white md:text-4xl">Dashboard</h1>
                    <p className="mt-2 text-gray-400">
                        Manage your assets, track your investments, and monitor your staking rewards
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                        asChild
                    >
                        <Link href="/dashboard/analytics">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Detailed Analytics
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white">Portfolio Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PortfolioValue />
                    </CardContent>
                </Card>

                <Card className="border-cyan-800 bg-black/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white">Staking Rewards</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StakingRewards />
                    </CardContent>
                </Card>

                <Card className="border-pink-800 bg-black/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        <AssetActivityList limit={3} />
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Portfolio Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <PortfolioChart timeframe="1m" />
                        </div>
                        <div className="mt-4 flex justify-center">
                            <Button variant="outline" className="border-purple-800" asChild>
                                <Link href="/dashboard/analytics">
                                    View Detailed Analytics <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Tabs defaultValue="owned">
                    <TabsList className="w-full border-b border-gray-800 bg-transparent">
                        <TabsTrigger
                            value="owned"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                        >
                            Owned Assets
                        </TabsTrigger>
                        <TabsTrigger
                            value="staked"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                        >
                            Staked Assets
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                        >
                            Notifications
                            <Badge className="ml-2 bg-purple-600 hover:bg-purple-600">
                                {mockUserData.notifications.filter((n) => !n.read).length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="owned" className="pt-6">
                        {ownedAssets.length > 0 ? (
                            <div className="space-y-4">
                                {ownedAssets.map((asset) => (
                                    <Card key={asset.id} className="border-purple-800 bg-black/60 backdrop-blur-sm overflow-hidden">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="w-full sm:w-32 bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center p-4">
                                                <div className="text-2xl font-bold text-white">{asset.symbol}</div>
                                            </div>
                                            <div className="flex-1 p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <Badge variant="outline" className="mb-2 border-purple-500 text-purple-300">
                                                            {asset.type}
                                                        </Badge>
                                                        <h3 className="text-lg font-bold text-white">{asset.name}</h3>
                                                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                                                            <Building className="h-3 w-3" />
                                                            <span>{asset.institution}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 sm:text-right">
                                                        <div className="text-sm text-gray-400">Owned Amount</div>
                                                        <div className="text-lg font-medium text-white">
                                                            {asset.ownedAmount.toLocaleString()} {asset.symbol}
                                                        </div>
                                                        <div className="text-sm text-gray-400 mt-1">
                                                            $
                                                            {(asset.ownedAmount * asset.priceUsd).toLocaleString(undefined, {
                                                                maximumFractionDigits: 2,
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Purchased on {new Date(asset.purchaseDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-purple-800 hover:bg-purple-900/20 hover:text-white"
                                                            asChild
                                                        >
                                                            <Link href={`/asset/${asset.id}`}>View Asset</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                                                            asChild
                                                        >
                                                            <Link href={`/asset/${asset.id}?action=stake`}>Stake Tokens</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 py-12">
                                <p className="text-center text-gray-400 mb-4">You don&#39;t own any assets yet</p>
                                <Button
                                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                                    asChild
                                >
                                    <Link href="/explore">
                                        Explore Assets <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="staked" className="pt-6">
                        {stakedAssets.length > 0 ? (
                            <div className="space-y-4">
                                {stakedAssets.map((asset) => (
                                    <Card key={asset.id} className="border-cyan-800 bg-black/60 backdrop-blur-sm overflow-hidden">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="w-full sm:w-32 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center p-4">
                                                <div className="text-2xl font-bold text-white">{asset.symbol}</div>
                                            </div>
                                            <div className="flex-1 p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <Badge variant="outline" className="mb-2 border-cyan-500 text-cyan-300">
                                                            {asset.type}
                                                        </Badge>
                                                        <h3 className="text-lg font-bold text-white">{asset.name}</h3>
                                                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                                                            <Building className="h-3 w-3" />
                                                            <span>{asset.institution}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 sm:text-right">
                                                        <div className="text-sm text-gray-400">Staked Amount</div>
                                                        <div className="text-lg font-medium text-white">
                                                            {asset.stakedAmount.toLocaleString()} {asset.symbol}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-green-400 mt-1 justify-end">
                                                            <TrendingUp className="h-3 w-3" />
                                                            <span>{asset.annualYield}% APY</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-gray-400">Claimable Rewards</span>
                                                        <span className="text-sm font-medium text-white">
                                                            {asset.claimableRewards.toFixed(2)} {asset.symbol}
                                                            <span className="text-gray-400 ml-1">
                                                                (${(asset.claimableRewards * asset.priceUsd).toFixed(2)})
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <Progress value={75} className="h-2 bg-gray-800" />
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            <Clock className="h-3 w-3 inline mr-1" />
                                                            Next reward in 5 days
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            Staked on {new Date(asset.stakeDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                                        <Shield className="h-3 w-3" />
                                                        <span>
                                                            Validating {((asset.stakedAmount / asset.totalSupply) * 100).toFixed(2)}% of total supply
                                                        </span>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 flex gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="border-cyan-800 hover:bg-cyan-900/20 hover:text-white">
                                                                    Claim Rewards
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="border-cyan-800 bg-black/95">
                                                                {isClaimingSuccess ? (
                                                                    <TransactionSuccess
                                                                        message="Rewards Claimed Successfully!"
                                                                        subMessage={`You have claimed ${asset.claimableRewards.toFixed(2)} ${asset.symbol} tokens worth $${(asset.claimableRewards * asset.priceUsd).toFixed(2)}`}
                                                                        onComplete={() => setIsClaimingSuccess(false)}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Claim Asset Rewards</DialogTitle>
                                                                            <DialogDescription>
                                                                                You are about to claim rewards for {asset.symbol}
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="space-y-4 py-4">
                                                                            <div className="rounded-lg bg-cyan-900/20 p-4">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <span className="text-gray-300">Claimable Rewards</span>
                                                                                    <span className="font-medium text-white">
                                                                                        {asset.claimableRewards.toFixed(2)} {asset.symbol}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-gray-300">Value</span>
                                                                                    <span className="font-medium text-white">
                                                                                        ${(asset.claimableRewards * asset.priceUsd).toFixed(2)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <Separator className="my-2" />

                                                                            <div className="text-xs text-gray-400">
                                                                                Claiming rewards will reset your reward counter for this asset. You will continue to
                                                                                earn rewards based on your staked amount.
                                                                            </div>
                                                                        </div>
                                                                        <DialogFooter>
                                                                            <Button variant="outline" className="border-gray-700">
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                                                                                onClick={() => handleClaimRewards(asset)}
                                                                            >
                                                                                Confirm Claim
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </>
                                                                )}

                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                                                            asChild
                                                        >
                                                            <Link href={`/asset/${asset.id}`}>Manage Stake</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 py-12">
                                <p className="text-center text-gray-400 mb-4">You haven&#39;t staked any assets yet</p>
                                <Button
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                                    asChild
                                >
                                    <Link href="/stake">
                                        Stake Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="notifications" className="pt-6">
                        <NotificationList />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

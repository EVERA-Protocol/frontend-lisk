/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, Shield } from "lucide-react"
import { mockUserData } from "@/lib/user-data"
import { mockAssets } from "@/lib/mock-data"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { TransactionSuccess } from "@/components/transaction-success"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function StakingRewards() {
    // Calculate total claimable rewards
    const totalClaimableRewards = mockUserData.stakedAssets.reduce((total: any, staked: any) => {
        return total + staked.claimableRewards
    }, 0)

    // Calculate total rewards value
    const totalRewardsValue = mockUserData.stakedAssets.reduce((total: any, staked: any) => {
        const asset = mockAssets.find((a) => a.id === staked.assetId)
        return total + (asset ? staked.claimableRewards * asset.priceUsd : 0)
    }, 0)

    // Calculate next reward date
    const nextRewardDate = new Date()
    nextRewardDate.setDate(nextRewardDate.getDate() + 5)

    const [isClaimingSuccess, setIsClaimingSuccess] = useState(false)
    const { toast } = useToast()

    const handleClaimRewards = () => {
        // In a real app, this would call an API to claim rewards
        console.log("Claiming rewards")

        // Show success state
        setIsClaimingSuccess(true)

        // Reset after 3 seconds and show toast
        setTimeout(() => {
            setIsClaimingSuccess(false)
            toast({
                title: "Rewards Claimed Successfully!",
                description: `You have claimed ${totalClaimableRewards.toFixed(2)} tokens worth $${totalRewardsValue.toFixed(2)}`,
            })
        }, 3000)
    }

    return (
        <div className="space-y-4">
            <div>
                <div className="text-sm text-gray-400">Claimable Rewards</div>
                <div className="text-2xl font-bold text-white">
                    ${totalRewardsValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-400">
                    {totalClaimableRewards.toFixed(2)} tokens across {mockUserData.stakedAssets.length} assets
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Next Reward</span>
                    <span className="text-xs text-gray-400">
                        <Clock className="mr-1 h-3 w-3 inline" />
                        {nextRewardDate.toLocaleDateString()}
                    </span>
                </div>
                <Progress value={65} className="h-2 bg-gray-800" />
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-cyan-900/20 p-3">
                <Shield className="h-5 w-5 text-cyan-400" />
                <div className="text-xs text-gray-300">
                    You&#39;re validating {mockUserData.stakedAssets.length} assets with AVS Eigenlayer
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                        disabled={totalClaimableRewards === 0}
                    >
                        Claim All Rewards
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-cyan-800 bg-black/95">
                    {isClaimingSuccess ? (
                        <TransactionSuccess
                            message="Rewards Claimed Successfully!"
                            subMessage={`You have claimed ${totalClaimableRewards.toFixed(2)} tokens worth $${totalRewardsValue.toFixed(2)}`}
                            onComplete={() => setIsClaimingSuccess(false)}
                        />
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-white">Claim Rewards</DialogTitle>
                                <DialogDescription>You are about to claim all your available staking rewards</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="rounded-lg bg-cyan-900/20 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-300">Total Claimable Rewards</span>
                                        <span className="font-medium text-white">{totalClaimableRewards.toFixed(2)} tokens</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Value</span>
                                        <span className="font-medium text-white">
                                            ${totalRewardsValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-300">Rewards Breakdown</h4>
                                    {mockUserData.stakedAssets.map((staked) => {
                                        const asset = mockAssets.find((a) => a.id === staked.assetId)
                                        if (!asset || staked.claimableRewards <= 0) return null

                                        return (
                                            <div key={staked.assetId} className="flex items-center justify-between text-sm text-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                                                    <span>{asset.symbol}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span>{staked.claimableRewards.toFixed(2)}</span>
                                                    <span className="text-gray-400">
                                                        (${(staked.claimableRewards * asset.priceUsd).toFixed(2)})
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <Separator className="my-2" />

                                <div className="text-xs text-gray-400">
                                    Claiming rewards will reset your reward counter. You will continue to earn rewards based on your
                                    staked amount.
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="border-gray-700">
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                                    onClick={handleClaimRewards}
                                >
                                    Confirm Claim
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

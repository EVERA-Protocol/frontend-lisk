"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { mockUserData } from "@/lib/user-data"
import { mockAssets } from "@/lib/mock-data"

export function PortfolioValue() {
    const [timeframe, setTimeframe] = useState("1m")

    // Calculate total portfolio value
    const totalValue = mockUserData.ownedAssets.reduce((total, owned) => {
        const asset = mockAssets.find((a) => a.id === owned.assetId)
        return total + (asset ? owned.amount * asset.priceUsd : 0)
    }, 0)

    // Calculate total staked value
    const stakedValue = mockUserData.stakedAssets.reduce((total, staked) => {
        const asset = mockAssets.find((a) => a.id === staked.assetId)
        return total + (asset ? staked.amount * asset.priceUsd : 0)
    }, 0)

    // Mock data for portfolio performance
    const performanceData = {
        "1d": { change: 1.2, isPositive: true },
        "1w": { change: -0.5, isPositive: false },
        "1m": { change: 3.8, isPositive: true },
        "1y": { change: 12.5, isPositive: true },
        all: { change: 24.7, isPositive: true },
    }

    const currentPerformance = performanceData[timeframe as keyof typeof performanceData]

    return (
        <div className="space-y-4">
            <div>
                <div className="text-sm text-gray-400">Total Value</div>
                <div className="text-2xl font-bold text-white">
                    ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div
                    className={`flex items-center text-sm ${currentPerformance.isPositive ? "text-green-400" : "text-red-400"}`}
                >
                    {currentPerformance.isPositive ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    <span>{currentPerformance.change}%</span>
                    <span className="ml-1 text-gray-500">({timeframe})</span>
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-3">
                <div>
                    <div className="text-xs text-gray-400">Staked Value</div>
                    <div className="text-sm font-medium text-white">
                        ${stakedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="flex items-center text-xs text-green-400">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>8.2% APY</span>
                </div>
            </div>

            <div>
                <Tabs defaultValue="1m" value={timeframe} onValueChange={setTimeframe}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="1d">1D</TabsTrigger>
                        <TabsTrigger value="1w">1W</TabsTrigger>
                        <TabsTrigger value="1m">1M</TabsTrigger>
                        <TabsTrigger value="1y">1Y</TabsTrigger>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="mt-4 h-24 w-full rounded-md bg-gradient-to-r from-purple-900/20 to-cyan-900/20 flex items-center justify-center">
                    <div className="text-xs text-gray-500">Portfolio Chart</div>
                </div>
            </div>
        </div>
    )
}

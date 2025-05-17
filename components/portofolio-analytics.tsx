"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { mockUserData } from "@/lib/user-data"
// import { mockAssets } from "@/lib/mock-data"
import { PortfolioChart } from "@/components/charts/portfolio-chart"
import { AssetAllocationChart } from "@/components/charts/asset-allocation-chart"
import { YieldComparisonChart } from "@/components/charts/yield-comparison-chart"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function PortfolioAnalytics() {
    const [timeframe, setTimeframe] = useState("1m")

    // Calculate total portfolio value
    // const totalValue = mockUserData.ownedAssets.reduce((total, owned) => {
    //     const asset = mockAssets.find((a) => a.id === owned.assetId)
    //     return total + (asset ? owned.amount * asset.priceUsd : 0)
    // }, 0)

    // // Calculate total staked value
    // const stakedValue = mockUserData.stakedAssets.reduce((total, staked) => {
    //     const asset = mockAssets.find((a) => a.id === staked.assetId)
    //     return total + (asset ? staked.amount * asset.priceUsd : 0)
    // }, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Portfolio Analytics</h2>
                    <p className="text-gray-400">Detailed analysis of your portfolio performance</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button variant="outline" className="border-purple-800">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <PerformanceMetrics />
            </div>

            <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Portfolio Performance</CardTitle>
                    <CardDescription>Track your portfolio value over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="1m" value={timeframe} onValueChange={setTimeframe}>
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="1d">1D</TabsTrigger>
                            <TabsTrigger value="1w">1W</TabsTrigger>
                            <TabsTrigger value="1m">1M</TabsTrigger>
                            <TabsTrigger value="1y">1Y</TabsTrigger>
                            <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="mt-4 h-80">
                        <PortfolioChart timeframe={timeframe} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                        <CardDescription>Distribution of your portfolio by asset type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <AssetAllocationChart />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Yield Comparison</CardTitle>
                        <CardDescription>Compare yields across your staked assets</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <YieldComparisonChart />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

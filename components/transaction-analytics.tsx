"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionVolumeChart } from "@/components/charts/transaction-volume-chart"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Filter } from "lucide-react"

export function TransactionAnalytics() {
    const [timeframe, setTimeframe] = useState("1m")
    const [transactionType, setTransactionType] = useState("all")

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Transaction Analytics</h2>
                    <p className="text-gray-400">Analysis of your transaction history</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-2">
                    <Button variant="outline" className="border-purple-800">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" className="border-purple-800">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Sort
                    </Button>
                </div>
            </div>

            <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Transaction Volume</CardTitle>
                    <CardDescription>Track your transaction activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <Tabs defaultValue="1m" value={timeframe} onValueChange={setTimeframe} className="flex-1">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="1d">1D</TabsTrigger>
                                <TabsTrigger value="1w">1W</TabsTrigger>
                                <TabsTrigger value="1m">1M</TabsTrigger>
                                <TabsTrigger value="1y">1Y</TabsTrigger>
                                <TabsTrigger value="all">All</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Tabs defaultValue="all" value={transactionType} onValueChange={setTransactionType} className="flex-1">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="buy">Buy</TabsTrigger>
                                <TabsTrigger value="sell">Sell</TabsTrigger>
                                <TabsTrigger value="stake">Stake</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="mt-4 h-80">
                        <TransactionVolumeChart timeframe={timeframe} transactionType={transactionType} />
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="rounded-lg border border-gray-800 p-3">
                            <p className="text-sm text-gray-400">Total Transactions</p>
                            <p className="text-xl font-bold text-white">32</p>
                        </div>
                        <div className="rounded-lg border border-gray-800 p-3">
                            <p className="text-sm text-gray-400">Buy Volume</p>
                            <p className="text-xl font-bold text-white">$12,450</p>
                        </div>
                        <div className="rounded-lg border border-gray-800 p-3">
                            <p className="text-sm text-gray-400">Sell Volume</p>
                            <p className="text-xl font-bold text-white">$3,280</p>
                        </div>
                        <div className="rounded-lg border border-gray-800 p-3">
                            <p className="text-sm text-gray-400">Avg. Transaction</p>
                            <p className="text-xl font-bold text-white">$489</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

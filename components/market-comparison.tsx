"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketComparisonChart } from "@/components/charts/market-comparison-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MarketComparison() {
    const [timeframe, setTimeframe] = useState("1m")
    const [benchmark, setBenchmark] = useState("market")

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Market Comparison</h2>
                    <p className="text-gray-400">Compare your portfolio performance against market benchmarks</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Select value={benchmark} onValueChange={setBenchmark}>
                        <SelectTrigger className="w-[180px] border-purple-800 bg-black/60">
                            <SelectValue placeholder="Select benchmark" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="market">Overall Market</SelectItem>
                            <SelectItem value="realestate">Real Estate Index</SelectItem>
                            <SelectItem value="energy">Energy Index</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure Index</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Performance Comparison</CardTitle>
                    <CardDescription>Your portfolio vs. market benchmarks</CardDescription>
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
                        <MarketComparisonChart timeframe={timeframe} benchmark={benchmark} />
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 rounded-lg border border-gray-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                                <p className="font-medium text-white">Your Portfolio</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Return</p>
                                    <p className="text-lg font-bold text-white">+24.8%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Volatility</p>
                                    <p className="text-lg font-bold text-white">12.3%</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 rounded-lg border border-gray-800 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-3 w-3 rounded-full bg-cyan-500"></div>
                                <p className="font-medium text-white">Market Benchmark</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Return</p>
                                    <p className="text-lg font-bold text-white">+18.2%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Volatility</p>
                                    <p className="text-lg font-bold text-white">15.7%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

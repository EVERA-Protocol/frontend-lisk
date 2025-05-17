"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, DollarSign } from "lucide-react"

export function PerformanceMetrics() {
    // Mock performance data
    const metrics = [
        {
            title: "Total Return",
            value: "+24.8%",
            change: "+2.5%",
            period: "30d",
            isPositive: true,
            icon: TrendingUp,
        },
        {
            title: "Avg. Annual Yield",
            value: "8.2%",
            change: "+0.3%",
            period: "30d",
            isPositive: true,
            icon: Clock,
        },
        {
            title: "Realized Gains",
            value: "$1,245.32",
            change: "-3.2%",
            period: "30d",
            isPositive: false,
            icon: DollarSign,
        },
    ]

    return (
        <>
            {metrics.map((metric, index) => (
                <Card key={index} className="border-purple-800 bg-black/60 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/50">
                                    <metric.icon className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">{metric.title}</p>
                                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                                </div>
                            </div>
                            <div
                                className={`flex items-center rounded-full px-2 py-1 text-xs ${metric.isPositive ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
                                    }`}
                            >
                                {metric.isPositive ? (
                                    <ArrowUpRight className="mr-1 h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="mr-1 h-3 w-3" />
                                )}
                                <span>
                                    {metric.change} ({metric.period})
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

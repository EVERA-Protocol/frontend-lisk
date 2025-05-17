"use client"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { PortfolioAnalytics } from "@/components/portofolio-analytics"
import { TransactionAnalytics } from "@/components/transaction-analytics"
import { MarketComparison } from "@/components/market-comparison"

export default function AnalyticsPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white md:text-4xl">Analytics</h1>
                </div>
                <p className="mt-2 text-gray-400">Detailed analytics and performance metrics for your portfolio</p>
            </div>

            <div className="space-y-12">
                <PortfolioAnalytics />

                <TransactionAnalytics />

                <MarketComparison />
            </div>
        </div>
    )
}

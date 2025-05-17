"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"
import { mockUserData } from "@/lib/user-data"
import { cn } from "@/lib/utils"

interface AssetActivityListProps {
    limit?: number
    assetId?: string
}

export function AssetActivityList({ limit, assetId }: AssetActivityListProps) {
    // Filter activities by asset if assetId is provided
    const filteredActivities = mockUserData.activities
        .filter((activity) => !assetId || activity.assetId === assetId)
        .slice(0, limit)

    if (filteredActivities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 py-6">
                <p className="text-center text-sm text-gray-400">No activity to display</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 rounded-lg border border-gray-800 p-3">
                    <div
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            activity.type === "buy"
                                ? "bg-green-900/50"
                                : activity.type === "sell"
                                    ? "bg-red-900/50"
                                    : activity.type === "stake"
                                        ? "bg-purple-900/50"
                                        : activity.type === "unstake"
                                            ? "bg-blue-900/50"
                                            : activity.type === "claim"
                                                ? "bg-yellow-900/50"
                                                : "bg-gray-900/50",
                        )}
                    >
                        {activity.type === "buy" && <ArrowDown className="h-4 w-4 text-green-400" />}
                        {activity.type === "sell" && <ArrowUp className="h-4 w-4 text-red-400" />}
                        {activity.type === "stake" && <ArrowDown className="h-4 w-4 text-purple-400" />}
                        {activity.type === "unstake" && <ArrowUp className="h-4 w-4 text-blue-400" />}
                        {activity.type === "claim" && <ArrowDown className="h-4 w-4 text-yellow-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-white truncate">{activity.title}</p>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                <Clock className="mr-1 h-3 w-3 inline" />
                                {activity.time}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                    </div>

                    {activity.txHash && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" asChild>
                            <Link href={`https://etherscan.io/tx/${activity.txHash}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                <span className="sr-only">View transaction</span>
                            </Link>
                        </Button>
                    )}
                </div>
            ))}

            {limit && mockUserData.activities.length > limit && (
                <div className="flex justify-center">
                    <Button variant="link" className="text-purple-400" asChild>
                        <Link href="/dashboard?tab=activity">View All Activity</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

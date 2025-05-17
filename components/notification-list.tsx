"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronRight, Clock, DollarSign, Info, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import { mockUserData } from "@/lib/user-data"
import { cn } from "@/lib/utils"

type NotificationType = "transaction" | "system" | "staking" | "asset"
type NotificationFilter = "all" | "unread" | NotificationType

interface NotificationListProps {
    limit?: number
    filter?: NotificationFilter
}

export function NotificationList({ limit, filter = "all" }: NotificationListProps) {
    const [expandedNotification, setExpandedNotification] = useState<string | null>(null)

    const filteredNotifications = mockUserData.notifications
        .filter((notification) => {
            if (filter === "all") return true
            if (filter === "unread") return !notification.read
            return notification.type === filter
        })
        .slice(0, limit)

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case "transaction":
                return <DollarSign className="h-5 w-5 text-green-400" />
            case "system":
                return <Info className="h-5 w-5 text-blue-400" />
            case "staking":
                return <Shield className="h-5 w-5 text-purple-400" />
            case "asset":
                return <TrendingUp className="h-5 w-5 text-cyan-400" />
            default:
                return <Info className="h-5 w-5 text-gray-400" />
        }
    }

    const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        // In a real app, this would call an API to mark the notification as read
        console.log("Marking notification as read:", id)
    }

    const toggleExpand = (id: string) => {
        setExpandedNotification(expandedNotification === id ? null : id)
    }

    if (filteredNotifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 py-12">
                <p className="text-center text-gray-400">No notifications to display</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {filteredNotifications.map((notification) => (
                <div
                    key={notification.id}
                    className={cn(
                        "rounded-lg border p-4 transition-colors cursor-pointer",
                        notification.read ? "border-gray-800 bg-black/20" : "border-purple-800 bg-purple-900/10",
                        expandedNotification === notification.id && "border-purple-600",
                    )}
                    onClick={() => toggleExpand(notification.id)}
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900">
                            {getNotificationIcon(notification.type as NotificationType)}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                                <p className={cn("font-medium", notification.read ? "text-gray-200" : "text-white")}>
                                    {notification.title}
                                </p>
                                <div className="flex items-center gap-2">
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 rounded-full hover:bg-purple-900/20"
                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                        >
                                            <Check className="h-3 w-3" />
                                            <span className="sr-only">Mark as read</span>
                                        </Button>
                                    )}
                                    <span className="flex items-center text-xs text-gray-500">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {notification.time}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400">{notification.message}</p>

                            {expandedNotification === notification.id && notification.actionUrl && (
                                <div className="mt-4 flex justify-end">
                                    <Button variant="outline" size="sm" className="border-purple-800" asChild>
                                        <Link href={notification.actionUrl}>
                                            {notification.actionText || "View Details"}
                                            <ChevronRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {limit && mockUserData.notifications.length > limit && (
                <div className="flex justify-center">
                    <Button variant="link" className="text-purple-400" asChild>
                        <Link href="/notifications">View All Notifications</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

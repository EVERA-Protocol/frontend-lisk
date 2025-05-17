"use client"

import { useEffect, useRef } from "react"
import { mockUserData } from "@/lib/user-data"
import { mockAssets } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface AssetAllocationChartProps {
    className?: string
}

export function AssetAllocationChart({ className }: AssetAllocationChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Calculate asset allocation by type
        const assetTypeAllocation: Record<string, number> = {}

        mockUserData.ownedAssets.forEach((owned) => {
            const asset = mockAssets.find((a) => a.id === owned.assetId)
            if (asset) {
                const value = owned.amount * asset.priceUsd
                if (assetTypeAllocation[asset.type]) {
                    assetTypeAllocation[asset.type] += value
                } else {
                    assetTypeAllocation[asset.type] = value
                }
            }
        })

        // Convert to array for easier processing
        const data = Object.entries(assetTypeAllocation).map(([type, value]) => ({
            type,
            value,
        }))

        // Sort by value (descending)
        data.sort((a, b) => b.value - a.value)

        // Calculate total value
        const totalValue = data.reduce((sum, item) => sum + item.value, 0)

        // Define colors for each asset type
        const colors = [
            "#a855f7", // purple
            "#06b6d4", // cyan
            "#ec4899", // pink
            "#f97316", // orange
            "#14b8a6", // teal
            "#8b5cf6", // violet
            "#f43f5e", // rose
        ]

        // Set canvas dimensions
        const width = canvasRef.current.width
        const height = canvasRef.current.height
        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(centerX, centerY) * 0.8

        // Draw pie chart
        let startAngle = 0

        data.forEach((item, index) => {
            const sliceAngle = (item.value / totalValue) * 2 * Math.PI
            const endAngle = startAngle + sliceAngle

            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, startAngle, endAngle)
            ctx.closePath()

            ctx.fillStyle = colors[index % colors.length]
            ctx.fill()

            // Draw label line and text
            const midAngle = startAngle + sliceAngle / 2
            const labelRadius = radius * 1.2
            const labelX = centerX + Math.cos(midAngle) * labelRadius
            const labelY = centerY + Math.sin(midAngle) * labelRadius

            // Draw line from pie to label
            ctx.beginPath()
            ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
            ctx.lineTo(labelX, labelY)
            ctx.strokeStyle = colors[index % colors.length]
            ctx.lineWidth = 1
            ctx.stroke()

            // Draw label text
            ctx.fillStyle = "#ffffff"
            ctx.font = "12px Inter, sans-serif"
            ctx.textAlign = labelX > centerX ? "left" : "right"
            ctx.textBaseline = "middle"
            ctx.fillText(
                `${item.type} (${((item.value / totalValue) * 100).toFixed(1)}%)`,
                labelX + (labelX > centerX ? 5 : -5),
                labelY,
            )

            startAngle = endAngle
        })

        // Draw center circle (donut hole)
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
        ctx.fillStyle = "#000000"
        ctx.fill()

        // Draw total value in center
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 16px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, centerX, centerY - 10)

        ctx.font = "12px Inter, sans-serif"
        ctx.fillStyle = "#9ca3af"
        ctx.fillText("Total Value", centerX, centerY + 15)
    }, [])

    return (
        <div className={cn("relative w-full h-full", className)}>
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
        </div>
    )
}

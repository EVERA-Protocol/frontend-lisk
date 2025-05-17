"use client"

import { useEffect, useRef } from "react"
import { mockUserData } from "@/lib/user-data"
import { mockAssets } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface YieldComparisonChartProps {
    className?: string
}

export function YieldComparisonChart({ className }: YieldComparisonChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Get staked assets with yield data
        const stakedAssets = mockUserData.stakedAssets.map((staked) => {
            const asset = mockAssets.find((a) => a.id === staked.assetId)
            return {
                symbol: asset?.symbol || "Unknown",
                name: asset?.name || "Unknown Asset",
                yield: asset?.annualYield || 0,
                stakedAmount: staked.amount,
                stakedValue: staked.amount * (asset?.priceUsd || 0),
                claimableRewards: staked.claimableRewards,
            }
        })

        // Sort by yield (descending)
        stakedAssets.sort((a, b) => b.yield - a.yield)

        // Set canvas dimensions
        const width = canvasRef.current.width
        const height = canvasRef.current.height

        // Chart dimensions
        const chartTop = 40
        const chartBottom = height - 60
        const chartHeight = chartBottom - chartTop
        const chartLeft = 80
        const chartRight = width - 100
        const chartWidth = chartRight - chartLeft

        // Find max yield for scaling
        const maxYield = Math.max(...stakedAssets.map((a) => a.yield)) * 1.2

        // Bar properties
        const barCount = stakedAssets.length
        const barWidth = Math.min(50, chartWidth / barCount / 1.5)
        const barSpacing = (chartWidth - barWidth * barCount) / (barCount + 1)

        // Draw axes
        ctx.beginPath()
        ctx.moveTo(chartLeft, chartTop)
        ctx.lineTo(chartLeft, chartBottom)
        ctx.lineTo(chartRight, chartBottom)
        ctx.strokeStyle = "#4b5563"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw horizontal grid lines
        const gridLineCount = 5
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
        ctx.font = "12px Inter, sans-serif"
        ctx.fillStyle = "#9ca3af"

        for (let i = 0; i <= gridLineCount; i++) {
            const y = chartBottom - (i / gridLineCount) * chartHeight
            const yieldValue = (i / gridLineCount) * maxYield

            ctx.beginPath()
            ctx.moveTo(chartLeft, y)
            ctx.lineTo(chartRight, y)
            ctx.strokeStyle = "#374151"
            ctx.lineWidth = 0.5
            ctx.stroke()

            ctx.fillText(`${yieldValue.toFixed(1)}%`, chartLeft - 10, y)
        }

        // Draw bars
        stakedAssets.forEach((asset, index) => {
            const x = chartLeft + barSpacing + index * (barWidth + barSpacing)
            const barHeight = (asset.yield / maxYield) * chartHeight
            const y = chartBottom - barHeight

            // Draw bar
            const gradient = ctx.createLinearGradient(0, y, 0, chartBottom)
            gradient.addColorStop(0, "#a855f7")
            gradient.addColorStop(1, "#06b6d4")

            ctx.fillStyle = gradient
            ctx.fillRect(x, y, barWidth, barHeight)

            // Draw border
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 1
            ctx.strokeRect(x, y, barWidth, barHeight)

            // Draw yield value on top of bar
            ctx.fillStyle = "#ffffff"
            ctx.textAlign = "center"
            ctx.textBaseline = "bottom"
            ctx.font = "bold 12px Inter, sans-serif"
            ctx.fillText(`${asset.yield}%`, x + barWidth / 2, y - 5)

            // Draw asset symbol below x-axis
            ctx.fillStyle = "#ffffff"
            ctx.textAlign = "center"
            ctx.textBaseline = "top"
            ctx.font = "12px Inter, sans-serif"
            ctx.fillText(asset.symbol, x + barWidth / 2, chartBottom + 10)

            // Draw staked value below symbol
            ctx.fillStyle = "#9ca3af"
            ctx.font = "10px Inter, sans-serif"
            ctx.fillText(
                `$${asset.stakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                x + barWidth / 2,
                chartBottom + 30,
            )
        })

        // Draw chart title
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 14px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText("Annual Yield Comparison", width / 2, 10)
    }, [])

    return (
        <div className={cn("relative w-full h-full", className)}>
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
        </div>
    )
}

"use client"

import { useEffect, useRef } from "react"
import { mockTransactionData } from "@/lib/chart-data"
import { cn } from "@/lib/utils"

interface TransactionVolumeChartProps {
    timeframe: string
    transactionType: string
    className?: string
}

export function TransactionVolumeChart({ timeframe, transactionType, className }: TransactionVolumeChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Get data for the selected timeframe and transaction type
        const allData = mockTransactionData[timeframe as keyof typeof mockTransactionData]

        // Filter data by transaction type if needed
        const data =
            transactionType === "all"
                ? allData
                : {
                    labels: allData.labels,
                    buy: transactionType === "buy" ? allData.buy : Array(allData.labels.length).fill(0),
                    sell: transactionType === "sell" ? allData.sell : Array(allData.labels.length).fill(0),
                    stake: transactionType === "stake" ? allData.stake : Array(allData.labels.length).fill(0),
                }

        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Set canvas dimensions
        const width = canvasRef.current.width
        const height = canvasRef.current.height

        // Chart dimensions
        const chartTop = 30
        const chartBottom = height - 60
        const chartHeight = chartBottom - chartTop
        const chartLeft = 60
        const chartRight = width - 20
        const chartWidth = chartRight - chartLeft

        // Calculate max value for scaling
        const maxBuy = Math.max(...data.buy)
        const maxSell = Math.max(...data.sell)
        const maxStake = Math.max(...data.stake)
        const maxValue = Math.max(maxBuy, maxSell, maxStake) * 1.2

        // Bar properties
        const barCount = data.labels.length
        const groupWidth = chartWidth / barCount
        const barWidth = groupWidth * 0.2
        const barSpacing = groupWidth * 0.1

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
            const value = (i / gridLineCount) * maxValue

            ctx.beginPath()
            ctx.moveTo(chartLeft, y)
            ctx.lineTo(chartRight, y)
            ctx.strokeStyle = "#374151"
            ctx.lineWidth = 0.5
            ctx.stroke()

            ctx.fillText(`$${value.toFixed(0)}`, chartLeft - 10, y)
        }

        // Draw bars
        data.labels.forEach((label, index) => {
            const x = chartLeft + index * groupWidth + groupWidth * 0.15

            // Only draw bars for the selected transaction type or all types
            if (transactionType === "all" || transactionType === "buy") {
                const buyHeight = (data.buy[index] / maxValue) * chartHeight
                const buyY = chartBottom - buyHeight

                ctx.fillStyle = "#a855f7" // purple
                ctx.fillRect(x, buyY, barWidth, buyHeight)
                ctx.strokeStyle = "#000000"
                ctx.lineWidth = 1
                ctx.strokeRect(x, buyY, barWidth, buyHeight)
            }

            if (transactionType === "all" || transactionType === "sell") {
                const sellHeight = (data.sell[index] / maxValue) * chartHeight
                const sellY = chartBottom - sellHeight

                ctx.fillStyle = "#ec4899" // pink
                ctx.fillRect(x + barWidth + barSpacing, sellY, barWidth, sellHeight)
                ctx.strokeStyle = "#000000"
                ctx.lineWidth = 1
                ctx.strokeRect(x + barWidth + barSpacing, sellY, barWidth, sellHeight)
            }

            if (transactionType === "all" || transactionType === "stake") {
                const stakeHeight = (data.stake[index] / maxValue) * chartHeight
                const stakeY = chartBottom - stakeHeight

                ctx.fillStyle = "#06b6d4" // cyan
                ctx.fillRect(x + 2 * (barWidth + barSpacing), stakeY, barWidth, stakeHeight)
                ctx.strokeStyle = "#000000"
                ctx.lineWidth = 1
                ctx.strokeRect(x + 2 * (barWidth + barSpacing), stakeY, barWidth, stakeHeight)
            }

            // Draw x-axis labels
            if (index % Math.ceil(barCount / 10) === 0) {
                ctx.fillStyle = "#9ca3af"
                ctx.textAlign = "center"
                ctx.textBaseline = "top"
                ctx.font = "12px Inter, sans-serif"
                ctx.fillText(label, x + groupWidth / 2, chartBottom + 10)
            }
        })

        // Draw legend
        if (transactionType === "all") {
            const legendY = 15
            const legendSpacing = 100

            // Buy
            ctx.fillStyle = "#a855f7"
            ctx.fillRect(chartLeft, legendY, 15, 15)
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 1
            ctx.strokeRect(chartLeft, legendY, 15, 15)

            ctx.fillStyle = "#ffffff"
            ctx.textAlign = "left"
            ctx.textBaseline = "middle"
            ctx.font = "12px Inter, sans-serif"
            ctx.fillText("Buy", chartLeft + 20, legendY + 7.5)

            // Sell
            ctx.fillStyle = "#ec4899"
            ctx.fillRect(chartLeft + legendSpacing, legendY, 15, 15)
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 1
            ctx.strokeRect(chartLeft + legendSpacing, legendY, 15, 15)

            ctx.fillStyle = "#ffffff"
            ctx.fillText("Sell", chartLeft + legendSpacing + 20, legendY + 7.5)

            // Stake
            ctx.fillStyle = "#06b6d4"
            ctx.fillRect(chartLeft + 2 * legendSpacing, legendY, 15, 15)
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 1
            ctx.strokeRect(chartLeft + 2 * legendSpacing, legendY, 15, 15)

            ctx.fillStyle = "#ffffff"
            ctx.fillText("Stake", chartLeft + 2 * legendSpacing + 20, legendY + 7.5)
        }
    }, [timeframe, transactionType])

    return (
        <div className={cn("relative w-full h-full", className)}>
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
        </div>
    )
}

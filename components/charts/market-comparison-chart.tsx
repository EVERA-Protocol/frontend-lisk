"use client"

import { useEffect, useRef } from "react"
import { mockMarketComparisonData } from "@/lib/chart-data"
import { cn } from "@/lib/utils"

interface MarketComparisonChartProps {
    timeframe: string
    benchmark: string
    className?: string
}

export function MarketComparisonChart({ timeframe, benchmark, className }: MarketComparisonChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Get data for the selected timeframe and benchmark
        const data =
            mockMarketComparisonData[timeframe as keyof typeof mockMarketComparisonData][
            benchmark as keyof (typeof mockMarketComparisonData)[keyof typeof mockMarketComparisonData]
            ]

        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Set canvas dimensions
        const width = canvasRef.current.width
        const height = canvasRef.current.height

        // Chart dimensions
        const chartTop = 30
        const chartBottom = height - 40
        const chartHeight = chartBottom - chartTop
        const chartLeft = 60
        const chartRight = width - 20
        const chartWidth = chartRight - chartLeft

        // Find min and max values for scaling
        const allValues = [...data.portfolio, ...data.benchmark]
        const min = Math.min(...allValues) * 0.95
        const max = Math.max(...allValues) * 1.05

        // Calculate scaling factors
        const xStep = chartWidth / (data.labels.length - 1)
        const yScale = chartHeight / (max - min)

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
            const value = min + (i / gridLineCount) * (max - min)

            ctx.beginPath()
            ctx.moveTo(chartLeft, y)
            ctx.lineTo(chartRight, y)
            ctx.strokeStyle = "#374151"
            ctx.lineWidth = 0.5
            ctx.stroke()

            ctx.fillText(`${value.toFixed(1)}%`, chartLeft - 10, y)
        }

        // Draw x-axis labels
        ctx.textAlign = "center"
        ctx.textBaseline = "top"

        for (let i = 0; i < data.labels.length; i += Math.ceil(data.labels.length / 6)) {
            const x = chartLeft + i * xStep
            ctx.fillText(data.labels[i], x, chartBottom + 10)
        }

        // Draw portfolio line
        ctx.beginPath()
        ctx.moveTo(chartLeft, chartBottom - (data.portfolio[0] - min) * yScale)

        for (let i = 1; i < data.portfolio.length; i++) {
            ctx.lineTo(chartLeft + i * xStep, chartBottom - (data.portfolio[i] - min) * yScale)
        }

        ctx.strokeStyle = "#a855f7" // purple
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw benchmark line
        ctx.beginPath()
        ctx.moveTo(chartLeft, chartBottom - (data.benchmark[0] - min) * yScale)

        for (let i = 1; i < data.benchmark.length; i++) {
            ctx.lineTo(chartLeft + i * xStep, chartBottom - (data.benchmark[i] - min) * yScale)
        }

        ctx.strokeStyle = "#06b6d4" // cyan
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw dots at the end of each line
        const lastPortfolioIndex = data.portfolio.length - 1
        const lastBenchmarkIndex = data.benchmark.length - 1

        // Portfolio dot
        ctx.beginPath()
        ctx.arc(
            chartLeft + lastPortfolioIndex * xStep,
            chartBottom - (data.portfolio[lastPortfolioIndex] - min) * yScale,
            5,
            0,
            Math.PI * 2,
        )
        ctx.fillStyle = "#a855f7"
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.stroke()

        // Benchmark dot
        ctx.beginPath()
        ctx.arc(
            chartLeft + lastBenchmarkIndex * xStep,
            chartBottom - (data.benchmark[lastBenchmarkIndex] - min) * yScale,
            5,
            0,
            Math.PI * 2,
        )
        ctx.fillStyle = "#06b6d4"
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw legend
        const legendY = 15
        const legendSpacing = 200

        // Portfolio
        ctx.beginPath()
        ctx.moveTo(chartLeft, legendY)
        ctx.lineTo(chartLeft + 30, legendY)
        ctx.strokeStyle = "#a855f7"
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(chartLeft + 15, legendY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#a855f7"
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.font = "12px Inter, sans-serif"
        ctx.fillText("Your Portfolio", chartLeft + 40, legendY)

        // Benchmark
        ctx.beginPath()
        ctx.moveTo(chartLeft + legendSpacing, legendY)
        ctx.lineTo(chartLeft + legendSpacing + 30, legendY)
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(chartLeft + legendSpacing + 15, legendY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#06b6d4"
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.fillStyle = "#ffffff"
        ctx.fillText(
            benchmark === "market"
                ? "Overall Market"
                : benchmark === "realestate"
                    ? "Real Estate Index"
                    : benchmark === "energy"
                        ? "Energy Index"
                        : "Infrastructure Index",
            chartLeft + legendSpacing + 40,
            legendY,
        )
    }, [timeframe, benchmark])

    return (
        <div className={cn("relative w-full h-full", className)}>
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
        </div>
    )
}

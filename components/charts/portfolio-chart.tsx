"use client"

import { useEffect, useRef } from "react"
import { mockPortfolioData } from "@/lib/chart-data"
import { cn } from "@/lib/utils"

interface PortfolioChartProps {
    timeframe: string
    className?: string
}

export function PortfolioChart({ timeframe, className }: PortfolioChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        // Get data for the selected timeframe
        const data = mockPortfolioData[timeframe as keyof typeof mockPortfolioData]

        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Set canvas dimensions
        const width = canvasRef.current.width
        const height = canvasRef.current.height

        // Find min and max values for scaling
        const values = data.values
        const min = Math.min(...values) * 0.95
        const max = Math.max(...values) * 1.05

        // Calculate scaling factors
        const xStep = width / (data.values.length - 1)
        const yScale = height / (max - min)

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, "rgba(168, 85, 247, 0.4)")
        gradient.addColorStop(1, "rgba(168, 85, 247, 0)")

        // Draw line
        ctx.beginPath()
        ctx.moveTo(0, height - (values[0] - min) * yScale)

        for (let i = 1; i < values.length; i++) {
            ctx.lineTo(i * xStep, height - (values[i] - min) * yScale)
        }

        // Draw fill
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw line again (on top of fill)
        ctx.beginPath()
        ctx.moveTo(0, height - (values[0] - min) * yScale)

        for (let i = 1; i < values.length; i++) {
            ctx.lineTo(i * xStep, height - (values[i] - min) * yScale)
        }

        ctx.strokeStyle = "#a855f7"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw dots at data points
        for (let i = 0; i < values.length; i += Math.ceil(values.length / 10)) {
            ctx.beginPath()
            ctx.arc(i * xStep, height - (values[i] - min) * yScale, 4, 0, Math.PI * 2)
            ctx.fillStyle = "#a855f7"
            ctx.fill()
            ctx.strokeStyle = "#000"
            ctx.lineWidth = 1
            ctx.stroke()
        }

        // Draw axes labels
        ctx.fillStyle = "#9ca3af"
        ctx.font = "12px Inter, sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`$${min.toFixed(2)}`, 5, height - 5)
        ctx.textAlign = "right"
        ctx.fillText(`$${max.toFixed(2)}`, width - 5, 15)

        // Draw timeframe labels
        ctx.textAlign = "left"
        ctx.fillText(data.labels[0], 5, height - 20)
        ctx.textAlign = "right"
        ctx.fillText(data.labels[data.labels.length - 1], width - 5, height - 20)
    }, [timeframe])

    return (
        <div className={cn("relative w-full h-full", className)}>
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
        </div>
    )
}

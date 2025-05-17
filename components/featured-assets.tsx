"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import { mockAssets } from "@/lib/mock-data"

export function FeaturedAssets() {
  const [visibleAssets, setVisibleAssets] = useState(3)

  const featuredAssets = mockAssets.slice(0, visibleAssets)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredAssets.map((asset) => (
          <Card
            key={asset.id}
            className="overflow-hidden border-purple-800 bg-black/60 backdrop-blur-sm transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20"
          >
            <div className="aspect-video bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center">
              <div className="text-4xl font-bold text-white">{asset.symbol}</div>
            </div>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  {asset.type}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Shield className="h-3 w-3" />
                  <span>{((asset.stakedAmount / asset.totalSupply) * 100).toFixed(0)}% staked</span>
                </div>
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{asset.name}</h3>
              <div className="mb-3 flex items-center gap-1 text-sm text-gray-400">
                <Building className="h-3 w-3" />
                <span>{asset.institution}</span>
              </div>
              <p className="mb-4 text-sm text-gray-400 line-clamp-2">{asset.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Harga</div>
                  <div className="text-lg font-medium text-white">${asset.priceUsd.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Yield</div>
                  <div className="flex items-center gap-1 text-lg font-medium text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    {asset.annualYield}%
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-900/30 p-6 pt-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                <Link href={`/asset/${asset.id}`}>
                  Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {visibleAssets < mockAssets.length && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-purple-800 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200"
            onClick={() => setVisibleAssets((prev) => Math.min(prev + 3, mockAssets.length))}
          >
            View More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

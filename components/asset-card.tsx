import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Building, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Asset } from "@/lib/types"

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <Card className="overflow-hidden border-purple-800 bg-black/60 backdrop-blur-sm transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20">
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
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

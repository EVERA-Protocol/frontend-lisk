"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AssetCard } from "@/components/asset-card"
import { Search, SlidersHorizontal, Loader2, RefreshCw } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Asset } from "@/lib/types"
import Link from "next/link"

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [assetTypes, setAssetTypes] = useState<string[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch assets from backend API
  const fetchAssets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Replace line 31:
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GO_URL || 'http://localhost:8080'}/api/assets/`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assets: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setAssets(data.data.assets || [])
      } else {
        throw new Error(data.message || 'Failed to fetch assets')
      }
    } catch (err) {
      console.error('Error fetching assets:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
      setAssets([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load assets on component mount
  useEffect(() => {
    fetchAssets()
  }, [])

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.institution.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPrice = asset.priceUsd >= priceRange[0] && asset.priceUsd <= priceRange[1]

    const matchesType = assetTypes.length === 0 || assetTypes.includes(asset.type)

    return matchesSearch && matchesPrice && matchesType
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sortBy === "priceAsc") return a.priceUsd - b.priceUsd
    if (sortBy === "priceDesc") return b.priceUsd - a.priceUsd
    if (sortBy === "staked") return b.stakedAmount - a.stakedAmount
    return 0
  })

  const handleAssetTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setAssetTypes([...assetTypes, type])
    } else {
      setAssetTypes(assetTypes.filter((t) => t !== type))
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Explore Assets</h1>
          <p className="mt-2 text-gray-400">Discover and invest in tokenized real-world assets</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-gray-400">Loading assets from blockchain...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Explore Assets</h1>
          <p className="mt-2 text-gray-400">Discover and invest in tokenized real-world assets</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <p className="text-red-400 mb-4">⚠️ {error}</p>
            <Button
              onClick={fetchAssets}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Explore Assets</h1>
        <p className="mt-2 text-gray-400">
          Discover and invest in tokenized real-world assets ({assets.length} assets available)
        </p>
        {assets.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAssets}
            className="mt-2 text-purple-400 hover:text-purple-300"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Refresh
          </Button>
        )}
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">No assets minted yet</h3>
            <p className="text-gray-400 mb-6">Be the first to tokenize a real-world asset!</p>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
              <Link href="/mint">Mint Your First Asset</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by asset name or institution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-800 bg-black/60"
          />
        </div>
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] border-purple-800 bg-black/60">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              <SelectItem value="staked">Staked Amount</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-purple-800 bg-black/60">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="border-purple-800 bg-black/95">
              <SheetHeader>
                <SheetTitle>Filter Assets</SheetTitle>
                    <SheetDescription>Adjust filters to find the assets you&#39;re looking for</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                      <h3 className="text-sm font-medium">Price Range (USD)</h3>
                  <Slider
                        defaultValue={[0, 1000]}
                        max={1000}
                        step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                  <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">${priceRange[0]}</span>
                        <span className="text-sm text-gray-400">${priceRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Asset Type</h3>
                  <div className="space-y-2">
                    {["Real Estate", "Energy", "Infrastructure", "Credit", "Art"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={assetTypes.includes(type)}
                          onCheckedChange={(checked) => handleAssetTypeChange(type, checked as boolean)}
                        />
                        <Label htmlFor={`type-${type}`}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  onClick={() => {
                        setPriceRange([0, 1000])
                    setAssetTypes([])
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {sortedAssets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 py-12">
          <p className="text-center text-gray-400">No assets found with the selected filters</p>
          <Button
            variant="link"
            className="mt-2 text-purple-400"
            onClick={() => {
              setSearchTerm("")
                  setPriceRange([0, 1000])
              setAssetTypes([])
            }}
          >
            Reset all filters
          </Button>
        </div>
          )}
        </>
      )}
    </div>
  )
}

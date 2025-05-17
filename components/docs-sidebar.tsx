"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function DocsSidebar() {
    const [searchQuery, setSearchQuery] = useState("")
    const pathname = usePathname()

    const docsCategories = [
        {
            title: "Getting Started",
            items: [
                { title: "Introduction", href: "/docs/introduction" },
                { title: "Wallet Connection", href: "/docs/wallet-connection" },
                { title: "Buying Assets", href: "/docs/buying-assets" },
                { title: "Staking Guide", href: "/docs/staking-guide" },
            ],
        },
        {
            title: "For Investors",
            items: [
                { title: "Asset Types", href: "/docs/asset-types" },
                { title: "Portfolio Management", href: "/docs/portfolio-management" },
                { title: "Staking Strategies", href: "/docs/staking-strategies" },
                { title: "Tax Considerations", href: "/docs/tax-considerations" },
            ],
        },
        {
            title: "For Asset Creators",
            items: [
                { title: "Tokenization Process", href: "/docs/tokenization-process" },
                { title: "Required Documentation", href: "/docs/required-documentation" },
                { title: "Yield Distribution", href: "/docs/yield-distribution" },
                { title: "Asset Management", href: "/docs/asset-management" },
            ],
        },
        {
            title: "For Developers",
            items: [
                { title: "API Reference", href: "/docs/api-reference" },
                { title: "Smart Contracts", href: "/docs/smart-contracts" },
                { title: "Integration Guide", href: "/docs/integration-guide" },
                { title: "SDK Documentation", href: "/docs/sdk-documentation" },
            ],
        },
        {
            title: "Resources",
            items: [
                { title: "FAQ", href: "/docs/faq" },
                { title: "Glossary", href: "/docs/glossary" },
                { title: "Support", href: "/contact" },
            ],
        },
    ]

    // Filter docs based on search query
    const filteredDocs = searchQuery
        ? docsCategories
            .map((category) => ({
                ...category,
                items: category.items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())),
            }))
            .filter((category) => category.items.length > 0)
        : docsCategories

    return (
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-auto pb-10">
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-purple-800 bg-black/60"
                />
            </div>

            <div className="space-y-6">
                {filteredDocs.map((category, index) => (
                    <Collapsible key={index} defaultOpen={true}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium text-gray-400 hover:text-white">
                            {category.title}
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1 space-y-1">
                            {category.items.map((item) => (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start pl-4 text-sm",
                                        pathname === item.href ? "bg-purple-900/20 text-purple-400" : "text-gray-400 hover:text-white",
                                    )}
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <ChevronRight className="mr-2 h-3 w-3" />
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    )
}

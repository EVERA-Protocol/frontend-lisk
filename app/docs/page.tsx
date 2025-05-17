import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, BookOpen, Code, FileText, HelpCircle, Lightbulb, Wallet } from "lucide-react"
import Link from "next/link"
import { DocsSidebar } from "@/components/docs-sidebar"

export default function DocsPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-64 lg:w-72 shrink-0">
                    <DocsSidebar />
                </div>

                <div className="flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white md:text-4xl">Documentation</h1>
                        <p className="mt-2 text-gray-400">
                            Learn how to use the EVERA platform for tokenizing, buying, and staking real-world assets
                        </p>
                    </div>

                    <div className="space-y-8">
                        <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-purple-400" />
                                    Getting Started
                                </CardTitle>
                                <CardDescription>Everything you need to know to get started with EVERA</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border border-gray-800 p-4 hover:border-purple-500 transition-colors">
                                        <h3 className="mb-2 font-medium text-white">What is EVERA?</h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Learn about the EVERA platform and how it enables tokenization of real-world assets.
                                        </p>
                                        <Button variant="link" className="px-0 text-purple-400" asChild>
                                            <Link href="/docs/introduction">
                                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border border-gray-800 p-4 hover:border-purple-500 transition-colors">
                                        <h3 className="mb-2 font-medium text-white">Connecting Your Wallet</h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Learn how to connect your wallet to the EVERA platform to start investing.
                                        </p>
                                        <Button variant="link" className="px-0 text-purple-400" asChild>
                                            <Link href="/docs/wallet-connection">
                                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border border-gray-800 p-4 hover:border-purple-500 transition-colors">
                                        <h3 className="mb-2 font-medium text-white">Buying Your First Asset</h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            A step-by-step guide to buying your first tokenized real-world asset.
                                        </p>
                                        <Button variant="link" className="px-0 text-purple-400" asChild>
                                            <Link href="/docs/buying-assets">
                                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border border-gray-800 p-4 hover:border-purple-500 transition-colors">
                                        <h3 className="mb-2 font-medium text-white">Staking Guide</h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Learn how to stake your tokens and earn rewards through the AVS Eigenlayer.
                                        </p>
                                        <Button variant="link" className="px-0 text-purple-400" asChild>
                                            <Link href="/docs/staking-guide">
                                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="investors">
                            <TabsList className="w-full border-b border-gray-800 bg-transparent">
                                <TabsTrigger
                                    value="investors"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                                >
                                    For Investors
                                </TabsTrigger>
                                <TabsTrigger
                                    value="creators"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                                >
                                    For Asset Creators
                                </TabsTrigger>
                                <TabsTrigger
                                    value="developers"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                                >
                                    For Developers
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="investors" className="pt-6">
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-purple-800 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900">
                                                <Wallet className="h-6 w-6 text-purple-300" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-xl font-semibold text-white">Investor Guide</h2>
                                                <p className="mt-1 text-gray-400">
                                                    Learn how to invest in tokenized real-world assets, manage your portfolio, and earn passive
                                                    income through staking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Understanding Asset Types</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Learn about the different types of real-world assets available on the EVERA platform and their
                                                    characteristics.
                                                </p>
                                                <Button variant="outline" className="w-full border-purple-800" asChild>
                                                    <Link href="/docs/asset-types">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Portfolio Management</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Learn how to manage your portfolio, track performance, and optimize your investments.
                                                </p>
                                                <Button variant="outline" className="w-full border-purple-800" asChild>
                                                    <Link href="/docs/portfolio-management">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Staking Strategies</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Discover different staking strategies to maximize your yield and support asset validation.
                                                </p>
                                                <Button variant="outline" className="w-full border-purple-800" asChild>
                                                    <Link href="/docs/staking-strategies">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Tax Considerations</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Important tax considerations for investing in tokenized real-world assets.
                                                </p>
                                                <Button variant="outline" className="w-full border-purple-800" asChild>
                                                    <Link href="/docs/tax-considerations">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="creators" className="pt-6">
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-cyan-800 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-900">
                                                <FileText className="h-6 w-6 text-cyan-300" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-xl font-semibold text-white">Asset Creator Guide</h2>
                                                <p className="mt-1 text-gray-400">
                                                    Learn how to tokenize your real-world assets, set up yield distribution, and manage your
                                                    tokenized assets.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Tokenization Process</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    A comprehensive guide to the tokenization process, from application to token distribution.
                                                </p>
                                                <Button variant="outline" className="w-full border-cyan-800" asChild>
                                                    <Link href="/docs/tokenization-process">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Required Documentation</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Learn about the documentation required to tokenize different types of real-world assets.
                                                </p>
                                                <Button variant="outline" className="w-full border-cyan-800" asChild>
                                                    <Link href="/docs/required-documentation">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Yield Distribution</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Learn how to set up and manage yield distribution for your tokenized assets.
                                                </p>
                                                <Button variant="outline" className="w-full border-cyan-800" asChild>
                                                    <Link href="/docs/yield-distribution">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Asset Management</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Tools and best practices for managing your tokenized assets on the platform.
                                                </p>
                                                <Button variant="outline" className="w-full border-cyan-800" asChild>
                                                    <Link href="/docs/asset-management">Read Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="developers" className="pt-6">
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-pink-800 bg-gradient-to-br from-pink-900/20 to-purple-900/20 p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-900">
                                                <Code className="h-6 w-6 text-pink-300" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-xl font-semibold text-white">Developer Resources</h2>
                                                <p className="mt-1 text-gray-400">
                                                    Technical documentation, API references, and integration guides for developers.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>API Reference</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Complete API reference documentation for integrating with the EVERA platform.
                                                </p>
                                                <Button variant="outline" className="w-full border-pink-800" asChild>
                                                    <Link href="/docs/api-reference">View Documentation</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Smart Contracts</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Documentation for the smart contracts used in the EVERA platform.
                                                </p>
                                                <Button variant="outline" className="w-full border-pink-800" asChild>
                                                    <Link href="/docs/smart-contracts">View Documentation</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>Integration Guide</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Step-by-step guide for integrating your application with the EVERA platform.
                                                </p>
                                                <Button variant="outline" className="w-full border-pink-800" asChild>
                                                    <Link href="/docs/integration-guide">View Guide</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                                            <CardHeader>
                                                <CardTitle>SDK Documentation</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-400 mb-4">
                                                    Documentation for the EVERA SDK for JavaScript, Python, and other languages.
                                                </p>
                                                <Button variant="outline" className="w-full border-pink-800" asChild>
                                                    <Link href="/docs/sdk-documentation">View Documentation</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5 text-gray-400" />
                                    Frequently Asked Questions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-gray-800 p-4">
                                        <h3 className="mb-2 font-medium text-white">What is a Real World Asset (RWA)?</h3>
                                        <p className="text-sm text-gray-400">
                                            Real World Assets (RWAs) are physical or financial assets that exist in the real world, such as
                                            real estate, commodities, bonds, or art, that have been tokenized on a blockchain to enable
                                            fractional ownership, increased liquidity, and programmable features.
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-800 p-4">
                                        <h3 className="mb-2 font-medium text-white">How does asset validation work?</h3>
                                        <p className="text-sm text-gray-400">
                                            Asset validation on EVERA works through the AVS Eigenlayer staking system. Users stake tokens on
                                            assets they believe are legitimate and valuable. The more tokens staked on an asset, the higher
                                            its trust level. This creates a decentralized validation mechanism where the community
                                            collectively determines asset credibility.
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-800 p-4">
                                        <h3 className="mb-2 font-medium text-white">How are yields generated and distributed?</h3>
                                        <p className="text-sm text-gray-400">
                                            Yields are generated from the real-world performance of the underlying assets. For example, rental
                                            income from real estate, interest from loans, or revenue from infrastructure projects. These
                                            yields are collected by the asset issuers and distributed to token holders according to their
                                            ownership percentage and staking contribution.
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-gray-800 p-4">
                                        <h3 className="mb-2 font-medium text-white">What happens if I want to sell my tokens?</h3>
                                        <p className="text-sm text-gray-400">
                                            You can sell your tokens on the EVERA marketplace at any time, provided there are buyers willing
                                            to purchase them. If you have staked tokens, you&#39;ll need to unstake them first, which may be
                                            subject to a lock-up period depending on the staking terms.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <Button
                                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                                        asChild
                                    >
                                        <Link href="/docs/faq">
                                            View All FAQs <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-xl border border-purple-800 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-8">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600">
                                    <Lightbulb className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white">Need More Help?</h2>
                                    <p className="mt-2 text-gray-300">
                                        Can&#39;t find what you&#39;re looking for? Our support team is here to help.
                                    </p>
                                </div>
                                <Button size="lg" className="shrink-0 bg-white text-purple-900 hover:bg-gray-100" asChild>
                                    <Link href="/contact">Contact Support</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

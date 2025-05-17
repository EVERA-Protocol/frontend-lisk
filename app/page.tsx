import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FeaturedAssets } from "@/components/featured-assets"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black to-purple-950 py-20 md:py-32">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,0,255,0.4),transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,200,0.4),transparent_40%)]"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-purple-500 text-purple-300">
            Coming Soon
          </Badge>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            Tokenize{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Anything</span>{" "}
            on Blockchain
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Bring your real-world assets to blockchain with EVERA, a complete tokenization platform for institutions and
            individuals
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <Link href="/mint">
                Start Minting <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white">
              <Link href="/explore">Explore Assets</Link>
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-16 px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" /> },
              { icon: <div className="h-16 w-16 rounded-md bg-gradient-to-br from-cyan-400 to-cyan-600" /> },
              { icon: <div className="h-16 w-16 rotate-45 bg-gradient-to-br from-yellow-400 to-orange-600" /> },
              { icon: <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600" /> },
              { icon: <div className="h-16 w-16 bg-gradient-to-br from-indigo-400 to-indigo-600" /> },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center">
                {item.icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">Key Platform Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-purple-900 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20">
              <div className="mb-4 inline-flex rounded-lg bg-purple-900/50 p-3">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Mint Anything</h3>
              <p className="text-gray-400">
                Tokenize various types of real-world assets such as private credit, renewable energy projects, and
                digital infrastructure in minutes.
              </p>
            </div>
            <div className="rounded-xl border border-cyan-900 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-900/20">
              <div className="mb-4 inline-flex rounded-lg bg-cyan-900/50 p-3">
                <Shield className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">AVS Eigenlayer</h3>
              <p className="text-gray-400">
                Increase trust in your assets through the AVS Eigenlayer staking system, the more staked, the more
                trusted your asset becomes.
              </p>
            </div>
            <div className="rounded-xl border border-pink-900 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-pink-500 hover:shadow-lg hover:shadow-pink-900/20">
              <div className="mb-4 inline-flex rounded-lg bg-pink-900/50 p-3">
                <BarChart3 className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Yield for Institutions</h3>
              <p className="text-gray-400">
                Institutions can earn yield from tokenized assets, creating new revenue streams from real-world assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-950">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">Featured Assets</h2>
          <p className="mb-12 text-center text-gray-400">Explore assets that have been tokenized on our platform</p>
          <FeaturedAssets />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-cyan-900 p-8 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to tokenize your assets?</h2>
              <p className="mb-8 text-lg text-gray-200">
                Start your journey in bringing real-world assets to blockchain today.
              </p>
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                <Link href="/mint">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

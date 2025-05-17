import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Github, Twitter, DiscIcon as Discord } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-purple-900/20 bg-black py-12">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EVERA</span>
            </Link>
            <p className="mt-4 text-gray-400">Real-world asset tokenization platform using blockchain technology</p>
            <div className="mt-6 flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-purple-400">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/mint" className="text-gray-400 hover:text-purple-400">
                  Mint
                </Link>
              </li>
              <li>
                <Link href="/stake" className="text-gray-400 hover:text-purple-400">
                  Stake
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400">
                  Docs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Subscribe</h3>
            <p className="mb-4 text-gray-400">Get the latest updates about new assets and platform features</p>
            <div className="flex gap-2">
              <Input placeholder="Your Email" className="border-purple-800 bg-black/60" />
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} EVERA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

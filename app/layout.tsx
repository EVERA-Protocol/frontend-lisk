import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
import { Web3Provider } from "./Web3Provider"
import AppShell from "@/components/app-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EVERA | Real World Asset Tokenization",
  description: "Real world asset tokenization platform using blockchain technology",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange> */}
        <Web3Provider>
          <AppShell>
            {children}
          </AppShell>
        </Web3Provider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

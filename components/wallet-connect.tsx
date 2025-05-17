"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, QrCode, Copy, Check } from "lucide-react"
import Image from "next/image";

interface WalletConnectProps {
    onConnect?: () => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

    const wallets = [
        { id: "metamask", name: "MetaMask", icon: "/placeholder.svg?height=40&width=40" },
        { id: "walletconnect", name: "WalletConnect", icon: "/placeholder.svg?height=40&width=40" },
        { id: "coinbase", name: "Coinbase Wallet", icon: "/placeholder.svg?height=40&width=40" },
        { id: "trustwallet", name: "Trust Wallet", icon: "/placeholder.svg?height=40&width=40" },
    ]

    const handleConnect = () => {
        // In a real app, this would connect to the selected wallet
        console.log("Connecting to wallet:", selectedWallet)
        setIsDialogOpen(false)
        if (onConnect) onConnect()
    }

    const handleCopyAddress = () => {
        // In a real app, this would copy the wallet address to clipboard
        navigator.clipboard.writeText("0x1234...5678")
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-purple-800 bg-black/95 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Connect Wallet</DialogTitle>
                        <DialogDescription>Connect your wallet to access the EVERA platform</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="popular" className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="popular">Popular</TabsTrigger>
                            <TabsTrigger value="more">More Options</TabsTrigger>
                        </TabsList>
                        <TabsContent value="popular" className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                {wallets.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-colors cursor-pointer ${selectedWallet === wallet.id
                                            ? "border-purple-500 bg-purple-900/20"
                                            : "border-gray-800 hover:border-purple-800 hover:bg-purple-900/10"
                                            }`}
                                        onClick={() => setSelectedWallet(wallet.id)}
                                    >
                                        <Image
                                            src={wallet.icon || "/placeholder.svg"}
                                            alt={wallet.name}
                                            className="mb-2 h-10 w-10 rounded-full"
                                        />
                                        <span className="text-sm font-medium text-white">{wallet.name}</span>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="more" className="mt-4">
                            <div className="rounded-lg border border-gray-800 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <QrCode className="h-5 w-5 text-purple-400" />
                                        <div>
                                            <h3 className="font-medium text-white">Scan QR Code</h3>
                                            <p className="text-xs text-gray-400">Scan with your mobile wallet</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-purple-800">
                                        Show QR
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 rounded-lg border border-gray-800 p-4">
                                <h3 className="mb-2 font-medium text-white">Connect Manually</h3>
                                <p className="mb-4 text-xs text-gray-400">Copy the address below and connect manually in your wallet</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 rounded-md bg-gray-900 px-3 py-2 font-mono text-sm text-gray-300">
                                        0x1234...5678
                                    </div>
                                    <Button variant="outline" size="icon" className="border-purple-800" onClick={handleCopyAddress}>
                                        {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6">
                        <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                            disabled={!selectedWallet}
                            onClick={handleConnect}
                        >
                            Connect
                        </Button>
                        <p className="mt-4 text-center text-xs text-gray-500">
                            By connecting your wallet, you agree to our{" "}
                            <a href="/terms" className="text-purple-400 hover:underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-purple-400 hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

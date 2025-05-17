/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { ArrowRight, ExternalLink, Info, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useAccount, useWriteContract } from "wagmi"
import { wagmiContractLaunchpadConfig } from "@/services/contract"
import { RWALaunchpadContract } from "@/services/contractAddress"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TransactionSuccess } from "@/components/transaction-success"

export default function MintPage() {
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract();

  const [formData, setFormData] = useState<{
    name: string;
    symbol: string;
    institutionName: string;
    institutionAddress: string;
    supportingDocs: File | null;
    supportingImage: File | null;
    totalSupply: string;
    pricePerRWA: string;
    description: string;
  }>({
    name: "",
    symbol: "",
    institutionName: "",
    institutionAddress: "",
    supportingDocs: null,
    supportingImage: null,
    totalSupply: "",
    pricePerRWA: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, supportingDocs: file }))
  }

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, supportingImage: file }))
  }

  const executeContract = async (config: any) => {
    try {
      await writeContractAsync(config);
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error("Error creating RWA token:", error)
      toast({
        title: "Error creating RWA token",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
    e.preventDefault()
    console.log("Form submitted:", formData)

    const docs = new FormData();
    if (formData.supportingDocs) docs.set("file", formData.supportingDocs);

    const uploadRequestDocs = await fetch("/api/files", {
      method: "POST",
      body: docs,
    });

    const docsUrl = await uploadRequestDocs.json();

    const img = new FormData();
    if (formData.supportingImage) img.set("file", formData.supportingImage);

    const uploadRequestImg = await fetch("/api/files", {
      method: "POST",
      body: img,
    });

    const imgUrl = await uploadRequestImg.json();

    executeContract({
      ...wagmiContractLaunchpadConfig,
      functionName: 'createRWAToken',
      args: [formData.name, formData.symbol, formData.institutionName, formData.institutionAddress, docsUrl, imgUrl, BigInt(formData.totalSupply), BigInt(formData.pricePerRWA), formData.description],
    })

    // Simulate successful submission
    toast({
      title: "Mint request successfully submitted",
      description: "Our team will review your request within 24-48 hours.",
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      symbol: "",
      institutionName: "",
      institutionAddress: "",
      supportingDocs: null,
      supportingImage: null,
      totalSupply: "",
      pricePerRWA: "",
      description: "",
    })
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    resetForm()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Mint RWA Token</h1>
          <p className="mt-2 text-gray-400">Tokenize your real-world assets by filling out the form below</p>
        </div>

        <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Token Mint Form</CardTitle>
            <CardDescription>Complete all required information to start the tokenization process</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              <div className="grid gap-4 md:grid-cols-2 items-start">
                <div className="space-y-2 text-white">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your asset name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-purple-800 bg-black/60"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">RWA Symbol</Label>
                  <Input
                    id="symbol"
                    name="symbol"
                    placeholder="Example: RERA"
                    value={formData.symbol}
                    onChange={handleChange}
                    className="border-purple-800 bg-black/60"
                    required
                  />
                </div>
              </div>


              <div className="space-y-2 text-white">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  name="institutionName"
                  placeholder="Your company or institution name"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="border-purple-800 bg-black/60"
                  required
                />
              </div>

              <div className="space-y-2 text-white">
                <Label htmlFor="institutionAddress">Institution Address</Label>
                <Input
                  id="institutionAddress"
                  name="institutionAddress"
                  placeholder="Full address of your institution"
                  value={formData.institutionAddress}
                  onChange={handleChange}
                  className="border-purple-800 bg-black/60"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 items-start">
                <div className="space-y-2 text-white">
                  <Label>Supporting Documents</Label>
                  <FileUpload onFileChange={handleFileChange} />
                </div>
                <div className="space-y-2 text-white">
                  <Label>Supporting Image</Label>
                  <FileUpload onFileChange={handleImageChange} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-white">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="totalSupply">Total RWA Supply</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">Total number of tokens to be issued</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="totalSupply"
                    name="totalSupply"
                    type="number"
                    placeholder="Example: 1000000"
                    value={formData.totalSupply}
                    onChange={handleChange}
                    className="border-purple-800 bg-black/60"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pricePerRWA">Price per RWA (USD)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">Initial price per token in USD</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="pricePerRWA"
                    name="pricePerRWA"
                    type="number"
                    step="0.01"
                    placeholder="Example: 1.00"
                    value={formData.pricePerRWA}
                    onChange={handleChange}
                    className="border-purple-800 bg-black/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the asset to be tokenized"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-32 border-purple-800 bg-black/60"
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  disabled={isSubmitting || isPending || !isConnected}
                >
                  {(isSubmitting || isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Submit Mint Request <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                {!isConnected && (
                  <p className="mt-2 text-xs text-amber-500">Please connect your wallet to submit a mint request</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t border-purple-800 pt-6">
            <p className="text-sm text-gray-400">
              By submitting this form, you agree that the EVERA team will review your request and may contact you for
              additional information before proceeding with the tokenization process.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <span>Contract Address: {RWALaunchpadContract}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md border-purple-800 bg-black/90 backdrop-blur-sm">
          <TransactionSuccess
            message="Mint Request Submitted Successfully"
            subMessage="Our team will review your request within 24-48 hours."
          />

          <div className="mt-2 space-y-4">
            <div className="rounded-lg bg-purple-900/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">Request ID</span>
                <span className="font-mono text-sm text-white">RWA001</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">Token Symbol</span>
                <span className="font-mono text-sm text-white">{formData.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span className="flex items-center text-sm text-yellow-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-yellow-400"></span>
                  Pending Review
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button
                variant="outline"
                className="flex-1 border-purple-800 bg-transparent text-white hover:bg-purple-900/30"
                onClick={handleCloseSuccessModal}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                onClick={handleCloseSuccessModal}
              >
                View Dashboard <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

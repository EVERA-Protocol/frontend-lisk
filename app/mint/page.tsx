/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { ArrowRight, ExternalLink, Info, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useAccount, useWriteContract, usePublicClient } from "wagmi"
import { wagmiContractLaunchpadConfig } from "@/services/contract"
import { RWALaunchpadContract } from "@/services/contractAddress"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TransactionSuccess } from "@/components/transaction-success"
import { parseEventLogs, parseEther } from "viem"

export default function MintPage() {
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // Enhanced state management for better UX
  const [formData, setFormData] = useState<{
    name: string;
    symbol: string;
    institutionName: string;
    institutionAddress: string;
    supportingDocs: File | null;
    supportingImage: File | null;
    totalSupply: string;
    expectedYield: string;
    description: string;
  }>({
    name: "",
    symbol: "",
    institutionName: "",
    institutionAddress: "",
    supportingDocs: null,
    supportingImage: null,
    totalSupply: "",
    expectedYield: "",
    description: "",
  });

  // Enhanced loading and success states
  const [mintingState, setMintingState] = useState<{
    stage: 'idle' | 'uploading' | 'contract' | 'backend' | 'parsing' | 'success' | 'error';
    message: string;
    error?: string;
  }>({
    stage: 'idle',
    message: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [assetId, setAssetId] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [contractAddress, setContractAddress] = useState<string | null>(null)

  // Show success modal when minting completes successfully
  useEffect(() => {
    if (mintingState.stage === 'success') {
      setShowSuccessModal(true)
    }
  }, [mintingState.stage])

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

  const executeContract = async (config: any, docsUrl?: string, imgUrl?: string) => {
    try {
      setMintingState({ stage: 'contract', message: 'Executing smart contract...' });
      
      const txHash = await writeContractAsync(config);
      setTxHash(txHash);
      
      toast({
        title: "Transaction submitted! 🚀",
        description: "Your transaction has been submitted to the blockchain.",
        variant: "default",
      });

      // Step 1: Save to backend with pending contract address
      setMintingState({ stage: 'backend', message: 'Saving asset to backend...' });
      let savedAssetId: string | null = null;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GO_URL || 'http://localhost:8080'}/api/assets/mint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            symbol: formData.symbol,
            institutionName: formData.institutionName,
            institutionAddress: formData.institutionAddress,
            description: formData.description,
            totalSupply: formData.totalSupply,
            expectedYield: formData.expectedYield,
            pricePerRWA: "1.0", // Default price per RWA token
            contractAddress: "pending", // Will be updated after parsing events
            txHash: txHash || "pending",
            documentsURI: docsUrl || "",
            imageURI: imgUrl || ""
          })
        });

        if (response.ok) {
          const data = await response.json();
          savedAssetId = data.data.id;
          setAssetId(savedAssetId);
          console.log('Asset saved to backend with ID:', savedAssetId);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Backend save failed');
        }
      } catch (backendError) {
        console.error('Backend API error:', backendError);
        setMintingState({ 
          stage: 'error', 
          message: 'Asset creation failed', 
          error: backendError instanceof Error ? backendError.message : 'Backend save failed' 
        });
        
        toast({
          title: "Warning: Transaction succeeded but asset not saved",
          description: "The blockchain transaction succeeded, but we couldn't save to our database.",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Wait for transaction receipt and parse events
      if (publicClient && txHash && savedAssetId) {
        try {
          setMintingState({ stage: 'parsing', message: 'Waiting for blockchain confirmation...' });

          const receipt = await publicClient.waitForTransactionReceipt({ 
            hash: txHash as `0x${string}` 
          });

          // Parse the RWATokenCreated event
          const logs = parseEventLogs({
            abi: wagmiContractLaunchpadConfig.abi,
            eventName: 'RWATokenCreated',
            logs: receipt.logs,
          });

          if (logs && logs.length > 0) {
            const event = logs[0];
            const tokenAddress = (event as any).args?.tokenAddress;
            
            if (tokenAddress) {
              setContractAddress(tokenAddress);
              
              // Step 3: Update backend with real contract address
              const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GO_URL || 'http://localhost:8080'}/api/assets/${savedAssetId}/contract`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  contractAddress: tokenAddress,
                  txHash: txHash
                })
              });

              if (updateResponse.ok) {
                console.log('Contract address updated successfully:', tokenAddress);
                setMintingState({ 
                  stage: 'success', 
                  message: 'Asset minted successfully!' 
                });
                
                toast({
                  title: "Asset minted successfully! 🎉",
                  description: `Token contract deployed at ${tokenAddress.slice(0, 10)}...`,
                  variant: "default",
                });
              } else {
                console.error('Failed to update contract address');
                setMintingState({ 
                  stage: 'error', 
                  message: 'Contract address update failed', 
                  error: 'Could not update contract address in backend' 
                });
                
                toast({
                  title: "Warning: Contract address not updated",
                  description: "Asset was saved but contract address is still pending.",
                  variant: "destructive",
                });
              }
            } else {
              console.error('Token address not found in event logs');
              setMintingState({ 
                stage: 'error', 
                message: 'Contract address not found', 
                error: 'Could not parse contract address from transaction' 
              });
              
              toast({
                title: "Warning: Contract address not found",
                description: "Asset was saved but contract address could not be parsed.",
                variant: "destructive",
              });
            }
          } else {
            console.error('RWATokenCreated event not found in transaction logs');
            setMintingState({ 
              stage: 'error', 
              message: 'Event not found', 
              error: 'RWATokenCreated event not found in transaction logs' 
            });
            
            toast({
              title: "Warning: Event not found",
              description: "Asset was saved but event parsing failed.",
              variant: "destructive",
            });
          }
        } catch (eventParsingError) {
          console.error('Error parsing transaction events:', eventParsingError);
          setMintingState({ 
            stage: 'error', 
            message: 'Event parsing failed', 
            error: eventParsingError instanceof Error ? eventParsingError.message : 'Unknown error during event parsing' 
          });
          
          toast({
            title: "Warning: Event parsing failed",
            description: "Asset was saved but we couldn't parse the contract address.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Error creating RWA token:", error)
      
      let errorMessage = "An unknown error occurred";
      if (error.message) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was cancelled by user";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for transaction";
        } else {
          errorMessage = error.message;
        }
      }
      
      setMintingState({ 
        stage: 'error', 
        message: 'Transaction failed', 
        error: errorMessage 
      });
      
      toast({
        title: "Error creating RWA token",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)

    try {
      // Step 1: Upload files
      setMintingState({ stage: 'uploading', message: 'Uploading supporting documents...' });

    const docs = new FormData();
    if (formData.supportingDocs) docs.set("file", formData.supportingDocs);

    const uploadRequestDocs = await fetch("/api/files", {
      method: "POST",
      body: docs,
    });

      if (!uploadRequestDocs.ok) {
        throw new Error('Failed to upload documents');
      }

    const docsUrl = await uploadRequestDocs.json();

      setMintingState({ stage: 'uploading', message: 'Uploading supporting images...' });

    const img = new FormData();
    if (formData.supportingImage) img.set("file", formData.supportingImage);

    const uploadRequestImg = await fetch("/api/files", {
      method: "POST",
      body: img,
    });

      if (!uploadRequestImg.ok) {
        throw new Error('Failed to upload images');
      }

    const imgUrl = await uploadRequestImg.json();

      // Convert user input to 18-decimal format for blockchain
      const totalSupplyWithDecimals = parseEther(formData.totalSupply);
      const expectedYieldWithDecimals = parseEther(formData.expectedYield);

      setMintingState({ stage: 'contract', message: 'Preparing contract execution...' });

    executeContract({
      ...wagmiContractLaunchpadConfig,
      functionName: 'createRWAToken',
        args: [
          formData.name, 
          formData.symbol, 
          formData.institutionName, 
          formData.institutionAddress, 
          docsUrl, 
          imgUrl, 
          totalSupplyWithDecimals, 
          expectedYieldWithDecimals, 
          formData.description
        ],
      }, docsUrl, imgUrl)

    } catch (error) {
      console.error("Error in form submission:", error);
      setMintingState({ 
        stage: 'error', 
        message: 'Submission failed', 
        error: error instanceof Error ? error.message : 'Unknown error during submission' 
      });
      
    toast({
        title: "Error submitting form",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
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
      expectedYield: "",
      description: "",
    })
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    setMintingState({ stage: 'idle', message: '' })
    setTxHash(null)
    setContractAddress(null)
    setAssetId(null)
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
                    <Label htmlFor="expectedYield">Expected Yield</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">Expected annual yield percentage for token holders</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="expectedYield"
                    name="expectedYield"
                    type="number"
                    step="0.01"
                    placeholder="Example: 8.50 (for 8.5% annual yield)"
                    value={formData.expectedYield}
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
                {/* Progress indicator */}
                {mintingState.stage !== 'idle' && mintingState.stage !== 'error' && (
                  <div className="mb-4 rounded-lg bg-purple-900/20 p-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                      <div>
                        <div className="font-medium text-white">
                          {mintingState.stage === 'uploading' && 'Uploading Files...'}
                          {mintingState.stage === 'contract' && 'Executing Contract...'}
                          {mintingState.stage === 'backend' && 'Saving Asset...'}
                          {mintingState.stage === 'parsing' && 'Confirming Transaction...'}
                          {mintingState.stage === 'success' && 'Completed Successfully!'}
                        </div>
                        <div className="text-sm text-gray-400">{mintingState.message}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error indicator */}
                {mintingState.stage === 'error' && (
                  <div className="mb-4 rounded-lg bg-red-900/20 p-4 border border-red-800">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-500 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-red-400">{mintingState.message}</div>
                        {mintingState.error && (
                          <div className="text-sm text-red-300 mt-1">{mintingState.error}</div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => setMintingState({ stage: 'idle', message: '' })}
                      variant="outline"
                      size="sm"
                      className="mt-3 border-red-800 text-red-400 hover:bg-red-900/30"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  disabled={mintingState.stage !== 'idle' || !isConnected}
                >
                  {mintingState.stage !== 'idle' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mintingState.stage === 'uploading' && 'Uploading...'}
                      {mintingState.stage === 'contract' && 'Processing Contract...'}
                      {mintingState.stage === 'backend' && 'Saving...'}
                      {mintingState.stage === 'parsing' && 'Confirming...'}
                      {mintingState.stage === 'success' && 'Completed!'}
                      {mintingState.stage === 'error' && 'Failed'}
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
                <span className="text-sm text-gray-400">Asset ID</span>
                <span className="font-mono text-sm text-white">{assetId || 'N/A'}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">Token Symbol</span>
                <span className="font-mono text-sm text-white">{formData.symbol}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">Transaction Hash</span>
                <span className="font-mono text-sm text-white">
                  {txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-6)}` : 'N/A'}
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">Contract Address</span>
                <span className="font-mono text-sm text-white">
                  {contractAddress ? `${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}` : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span className="flex items-center text-sm text-green-400">
                  <span className="mr-1 h-2 w-2 rounded-full bg-green-400"></span>
                  {mintingState.stage === 'success' ? 'Completed' : 'Processing'}
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
                onClick={() => {
                  handleCloseSuccessModal()
                  window.open('/explore', '_self')
                }}
              >
                View Asset <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

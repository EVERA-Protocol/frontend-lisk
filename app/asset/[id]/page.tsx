/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Info,
  Shield,
  Loader2,
  Store,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TransactionSuccess } from "@/components/transaction-success";
import { useWaitForTransactionReceipt, useWriteContract, useReadContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import { wagmiContractMarketplaceConfig } from "@/services/contract";

// Asset type to match backend response
interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  institution: string;
  institutionAddress: string;
  description: string;
  totalSupply: number;
  stakedAmount: number;
  priceUsd: number;
  annualYield: number;
  createdAt: string;
  updatedAt: string;
  blockchain: string;
  contractAddress: string;
  txHash: string;
  documentsURI: string;
  imageURI: string;
  documents: Array<{
    name: string;
    date: string;
    url: string;
  }>;
  topStakers: Array<{
    address: string;
    amount: number;
    percentage: number;
  }>;
  // Computed fields from backend
  availableSupply: number;
  marketCap: number;
  minInvestment: number;
  maxInvestment: number;
  stakingProgress: number;
  isContractActive: boolean;
  totalValue: number;
  stakedValue: number;
  availableValue: number;
}

export default function AssetDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const { address: userAddress } = useAccount();
  
  // Enhanced state management
  const [buyAmount, setBuyAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStakingSuccess, setIsStakingSuccess] = useState(false);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();
  const [buyTxHash, setBuyTxHash] = useState<`0x${string}` | undefined>();

  // Enhanced transaction states
  const [transactionState, setTransactionState] = useState<{
    type: 'idle' | 'approving' | 'buying' | 'listing' | 'staking';
    stage: 'idle' | 'pending' | 'confirmed' | 'error';
    message: string;
    error?: string;
  }>({
    type: 'idle',
    stage: 'idle',
    message: ''
  });

  // Buy dialog state
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

  // Marketplace state
  const [listAmount, setListAmount] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [unlistAmount, setUnlistAmount] = useState("");
  const [listTxHash, setListTxHash] = useState<`0x${string}` | undefined>();
  const [isListing, setIsListing] = useState(false);

  // IDRX Token Contract Address (you'll need to replace this with actual address)
  const IDRX_TOKEN_ADDRESS = "0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661" as const;

  // Check if connected user is the token creator
  const { data: isTokenCreator, isLoading: isCreatorLoading } = useReadContract({
    address: wagmiContractMarketplaceConfig.address as `0x${string}`,
    abi: wagmiContractMarketplaceConfig.abi,
    functionName: "isTokenCreator",
    args: asset?.contractAddress ? [asset.contractAddress as `0x${string}`] : undefined,
    account: userAddress,
    query: {
      enabled: !!asset?.contractAddress && !!userAddress,
    }
  });

  // Also check if user is the actual token owner (from RWAToken contract)
  const { data: tokenOwner } = useReadContract({
    address: asset?.contractAddress as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "owner",
    query: {
      enabled: !!asset?.contractAddress,
    }
  });

  // Get user's token balance
  const { data: userTokenBalance, refetch: refetchUserBalance } = useReadContract({
    address: asset?.contractAddress as `0x${string}`,
    abi: [
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!asset?.contractAddress && !!userAddress,
    }
  });

  // Get token decimals
  const { data: tokenDecimals } = useReadContract({
    address: asset?.contractAddress as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "decimals",
    query: {
      enabled: !!asset?.contractAddress,
    }
  });

  // Get current allowance for marketplace
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: asset?.contractAddress as `0x${string}`,
    abi: [
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "allowance",
    args: userAddress && wagmiContractMarketplaceConfig.address 
      ? [userAddress, wagmiContractMarketplaceConfig.address as `0x${string}`] 
      : undefined,
    query: {
      enabled: !!asset?.contractAddress && !!userAddress && !!wagmiContractMarketplaceConfig.address,
    }
  });

  // Get IDRX token allowance for marketplace
  const { data: idrxAllowance, refetch: refetchIdrxAllowance } = useReadContract({
    address: IDRX_TOKEN_ADDRESS,
    abi: [
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "allowance",
    args: userAddress && wagmiContractMarketplaceConfig.address 
      ? [userAddress, wagmiContractMarketplaceConfig.address as `0x${string}`] 
      : undefined,
    query: {
      enabled: !!userAddress && !!wagmiContractMarketplaceConfig.address,
    }
  });

  // Get user's IDRX balance
  const { data: idrxBalance, refetch: refetchIdrxBalance } = useReadContract({
    address: IDRX_TOKEN_ADDRESS,
    abi: [
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  });

  // Get IDRX token decimals
  const { data: idrxDecimals, refetch: refetchIdrxDecimals } = useReadContract({
    address: IDRX_TOKEN_ADDRESS,
    abi: [
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "decimals",
    query: {
      enabled: true,
    }
  });

  // User is creator if they're either the marketplace creator OR the actual token owner
  const isActualCreator = isTokenCreator || (tokenOwner === userAddress);

  // Get pool details from marketplace (for accurate buy data)
  const { data: poolDetails, refetch: refetchPoolDetails } = useReadContract({
    address: wagmiContractMarketplaceConfig.address as `0x${string}`,
    abi: wagmiContractMarketplaceConfig.abi,
    functionName: "getPoolDetails", 
    args: asset?.contractAddress ? [asset.contractAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!asset?.contractAddress,
    }
  });

  // Type guard for pool details
  const isValidPoolDetails = (data: unknown): data is [bigint, bigint, boolean] => {
    return Array.isArray(data) && data.length >= 3 && 
           typeof data[0] === 'bigint' && 
           typeof data[1] === 'bigint' && 
           typeof data[2] === 'boolean';
  };

  // Calculate formatted balance
  const formattedBalance = userTokenBalance && tokenDecimals 
    ? (Number(userTokenBalance) / Math.pow(10, Number(tokenDecimals))).toFixed(2)
    : "0.00";

  // Comprehensive data refresh function
  const refreshAllData = useCallback(async (showToast = false) => {
    try {
      if (showToast) {
        toast({
          title: "Refreshing data...",
          description: "Updating balances and pool status",
        });
      }
      
      await Promise.all([
        refetchPoolDetails(),
        refetchUserBalance(),
        refetchIdrxBalance(),
        refetchIdrxAllowance(),
        refetchAllowance(),
        refetchIdrxDecimals(),
      ]);
      
      if (showToast) {
        toast({
          title: "Data refreshed! ✅",
          description: "All balances and pool status updated",
        });
      }
      
      console.log('All data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (showToast) {
        toast({
          title: "Refresh failed",
          description: "Could not update data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [refetchPoolDetails, refetchUserBalance, refetchIdrxBalance, refetchIdrxAllowance, refetchAllowance, refetchIdrxDecimals, toast]);

  // Fetch asset data from API
  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GO_URL || 'http://localhost:8080'}/api/assets/${id}`);
        
        if (!response.ok) {
          throw new Error(`Asset not found (${response.status})`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setAsset(data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch asset');
        toast({
          title: "Error loading asset",
          description: "Could not load asset details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id, toast]);

  // Handle buy transaction confirmation
  const { isSuccess: isBuySuccess } =
    useWaitForTransactionReceipt({
      hash: buyTxHash,
    });

  // Reset transaction state when buy is successful
  useEffect(() => {
    if (isBuySuccess && transactionState.type === 'buying') {
      setTransactionState({
        type: 'buying',
        stage: 'confirmed',
        message: 'Purchase completed successfully!'
      });
      
      // Refresh all data immediately
      refreshAllData();
      
      // Close dialog and reset state after 2 seconds
      setTimeout(() => {
        setTransactionState({ type: 'idle', stage: 'idle', message: '' });
        setIsBuyDialogOpen(false);
      }, 2000);
      
      toast({
        title: "Purchase completed! 🎉",
        description: `Successfully purchased ${buyAmount} ${asset?.symbol}`,
      });
    }
  }, [isBuySuccess, transactionState.type, buyAmount, asset?.symbol, toast, refreshAllData]);

  // Contract configuration
  // const launchpadAddress = process.env.NEXT_PUBLIC_CONTRACT_RWA_MARKETPLACE;

  const handleBuy = async () => {
    if (!asset || !poolDetails) return;
    
    const poolData = poolDetails as any;
    const isPoolActive = poolData[2];
    const availableTokens = poolData[0];
    const poolPrice = poolData[1];
    
    console.log('🚀 handleBuy called with:');
    console.log('- buyAmount:', buyAmount);
    console.log('- asset.contractAddress:', asset.contractAddress);
    console.log('- poolDetails:', poolData);
    console.log('- isPoolActive:', isPoolActive);
    console.log('- availableTokens:', availableTokens?.toString());
    console.log('- poolPrice:', poolPrice?.toString());
    console.log('- tokenDecimals:', tokenDecimals);
    console.log('- idrxDecimals:', idrxDecimals);
    console.log('- IDRX_TOKEN_ADDRESS:', IDRX_TOKEN_ADDRESS);
    console.log('- userAddress:', userAddress);
    console.log('- idrxBalance:', idrxBalance?.toString());
    
    if (!isPoolActive) {
      toast({
        title: "Pool not active",
        description: "This token is not currently available for purchase",
        variant: "destructive",
      });
      return;
    }
    
    if (!buyAmount || Number(buyAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to buy",
        variant: "destructive",
      });
      return;
    }

    const buyAmountBigInt = parseEther(buyAmount);
    console.log('- buyAmountBigInt:', buyAmountBigInt.toString());
    
    if (buyAmountBigInt > availableTokens) {
      toast({
        title: "Insufficient tokens",
        description: `Only ${(Number(availableTokens) / Math.pow(10, Number(tokenDecimals) || 18)).toFixed(2)} tokens available`,
        variant: "destructive",
      });
      return;
    }

    if (!wagmiContractMarketplaceConfig.address) {
      toast({
        title: "Error",
        description: "Marketplace address not configured",
        variant: "destructive",
      });
      return;
    }

    // Calculate total cost properly accounting for different decimals
    const tokenDecimalsToUse = Number(tokenDecimals) || 18;
    const idrxDecimalsToUse = Number(idrxDecimals) || 2;
    
    // Convert buy amount to proper token units and calculate cost
    // poolPrice is in IDRX base units (e.g., 100 for 1.00 IDRX)
    // buyAmountBigInt is in token base units (e.g., 1e18 for 1 token)
    // We need: (tokenAmount * price) adjusted for decimal differences
    const totalCostInIdrxUnits = buyAmountBigInt * poolPrice / BigInt(Math.pow(10, tokenDecimalsToUse));
    
    console.log('💰 Cost calculation:');
    console.log('- tokenDecimalsToUse:', tokenDecimalsToUse);
    console.log('- idrxDecimalsToUse:', idrxDecimalsToUse);
    console.log('- totalCostInIdrxUnits:', totalCostInIdrxUnits.toString());
    console.log('- totalCostFormatted:', (Number(totalCostInIdrxUnits) / Math.pow(10, idrxDecimalsToUse)).toFixed(2));
    
    // Check IDRX balance
    if (idrxBalance && totalCostInIdrxUnits > idrxBalance) {
      const idrxBalanceFormatted = (Number(idrxBalance) / Math.pow(10, idrxDecimalsToUse)).toFixed(2);
      const totalCostFormatted = (Number(totalCostInIdrxUnits) / Math.pow(10, idrxDecimalsToUse)).toFixed(2);
      
      console.log('❌ Insufficient balance:');
      console.log('- Required:', totalCostFormatted, 'IDRX');
      console.log('- Available:', idrxBalanceFormatted, 'IDRX');
      
      toast({
        title: "Insufficient IDRX balance",
        description: `You need ${totalCostFormatted} IDRX but only have ${idrxBalanceFormatted} IDRX`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if IDRX approval is needed
      const needsApproval = !idrxAllowance || idrxAllowance < totalCostInIdrxUnits;
      
      console.log('🔐 Approval check:');
      console.log('- idrxAllowance:', idrxAllowance?.toString());
      console.log('- needsApproval:', needsApproval);

      if (needsApproval) {
        setTransactionState({
          type: 'approving',
          stage: 'pending',
          message: 'Approving IDRX tokens for marketplace...'
        });

        toast({
          title: "Step 1: Approving IDRX",
          description: "Please confirm the approval transaction",
        });

        console.log('📝 Approving IDRX with params:');
        console.log('- IDRX_TOKEN_ADDRESS:', IDRX_TOKEN_ADDRESS);
        console.log('- spender (marketplace):', wagmiContractMarketplaceConfig.address);
        console.log('- amount:', totalCostInIdrxUnits.toString());

        // Approve IDRX tokens
        const approveTxHash = await writeContractAsync({
          address: IDRX_TOKEN_ADDRESS,
        abi: [
          {
            inputs: [
                { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
              name: "approve",
              outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
          functionName: "approve",
          args: [wagmiContractMarketplaceConfig.address as `0x${string}`, totalCostInIdrxUnits],
        });

        console.log('✅ Approval tx hash:', approveTxHash);

        setTransactionState({
          type: 'approving',
          stage: 'confirmed',
          message: 'IDRX approval confirmed! Proceeding with purchase...'
        });

        toast({
          title: "Approval confirmed! ✅",
          description: "Now proceeding with token purchase...",
        });

        // Wait a bit and refetch allowance
        await new Promise(resolve => setTimeout(resolve, 2000));
        await refetchIdrxAllowance();
      }

      // Proceed with buy transaction
      setTransactionState({
        type: 'buying',
        stage: 'pending',
        message: 'Processing token purchase...'
      });

      toast({
        title: needsApproval ? "Step 2: Buying tokens" : "Buying tokens",
        description: "Please confirm the purchase transaction",
      });

      const tokenAddress = asset.contractAddress;
      
      console.log('🛒 Buying tokens with params:');
      console.log('- marketplace address:', wagmiContractMarketplaceConfig.address);
      console.log('- tokenAddress:', tokenAddress);
      console.log('- amount:', buyAmountBigInt.toString());
      console.log('- paymentTokenAddress (IDRX):', IDRX_TOKEN_ADDRESS);
      
      const txHash = await writeContractAsync({
        address: wagmiContractMarketplaceConfig.address as `0x${string}`,
        abi: wagmiContractMarketplaceConfig.abi,
        functionName: "buyTokens",
        args: [tokenAddress as `0x${string}`, buyAmountBigInt, IDRX_TOKEN_ADDRESS],
      });

      console.log('✅ Buy tx hash:', txHash);

      setTransactionState({
        type: 'buying',
        stage: 'confirmed',
        message: 'Purchase successful! Waiting for confirmation...'
      });

      toast({
        title: "Purchase submitted! 🚀",
        description: "Waiting for blockchain confirmation...",
      });

      setBuyTxHash(txHash);
      setBuyAmount("");
      setIsBuyDialogOpen(false);
      
      // Refetch pool details and balances immediately
      await refreshAllData();

    } catch (error) {
      console.error("❌ Buy error:", error);
      
      let errorMessage = "There was an error processing your purchase";
      if (error instanceof Error) {
        console.log('- Error message:', error.message);
        if (error.message.includes("ERC20InsufficientBalance")) {
          errorMessage = "Insufficient IDRX balance for this purchase";
        } else if (error.message.includes("ERC20InsufficientAllowance")) {
          errorMessage = "IDRX approval failed. Please try again.";
        } else if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was cancelled";
        } else {
          errorMessage = error.message;
        }
      }

      setTransactionState({
        type: 'buying',
        stage: 'error',
        message: 'Purchase failed',
        error: errorMessage
      });

      toast({
        title: "Purchase failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // List tokens function (creator only)
  const handleListTokens = async () => {
    if (!asset) return;
    
    if (!listAmount || Number(listAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to list",
        variant: "destructive",
      });
      return;
    }

    if (!listPrice || Number(listPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price per token",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough tokens
    const listAmountBigInt = parseEther(listAmount);
    if (userTokenBalance && listAmountBigInt > userTokenBalance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${formattedBalance} ${asset.symbol}`,
        variant: "destructive",
      });
      return;
    }

    setIsListing(true);

    try {
      // Convert price to IDRX base units using actual IDRX decimals
      const idrxDecimalsToUse = Number(idrxDecimals) || 2; // Default to 2 if not loaded
      const priceInBaseUnits = BigInt(Math.round(Number(listPrice) * Math.pow(10, idrxDecimalsToUse)));
      const tokenAddress = asset.contractAddress;

      // Check current allowance
      const needsApproval = !currentAllowance || currentAllowance < listAmountBigInt;

      if (needsApproval) {
        toast({
          title: "Step 1: Approving tokens...",
          description: "Please confirm the approval transaction",
        });

        // Step 1: Approve marketplace to spend tokens
        // const approveTxHash = await writeContractAsync({
        //   address: tokenAddress as `0x${string}`,
        //   abi: [
        //     {
        //       inputs: [
        //         { internalType: "address", name: "spender", type: "address" },
        //         { internalType: "uint256", name: "amount", type: "uint256" },
        //       ],
        //       name: "approve",
        //       outputs: [{ internalType: "bool", name: "", type: "bool" }],
        //       stateMutability: "nonpayable",
        //       type: "function",
        //     },
        //   ],
        //   functionName: "approve",
        //   args: [wagmiContractMarketplaceConfig.address as `0x${string}`, listAmountBigInt],
        // });

        toast({
          title: "Approval submitted! ✅",
          description: "Waiting for confirmation...",
        });

        // Wait a bit and refetch allowance
        await new Promise(resolve => setTimeout(resolve, 3000));
        await refetchAllowance();
      }

      toast({
        title: needsApproval ? "Step 2: Listing tokens..." : "Listing tokens...",
        description: "Please confirm the listing transaction",
      });

      // Step 2: List tokens in marketplace
      const listTxHash = await writeContractAsync({
        address: wagmiContractMarketplaceConfig.address as `0x${string}`,
        abi: wagmiContractMarketplaceConfig.abi,
        functionName: "addTokensToPool",
        args: [tokenAddress as `0x${string}`, listAmountBigInt, priceInBaseUnits],
      });

      toast({
        title: "Tokens listed successfully! 🚀",
        description: `Listed ${listAmount} ${asset.symbol} at ${listPrice} IDRX each`,
      });

      setListTxHash(listTxHash);
      setListAmount("");
      setListPrice("");
      
    } catch (error) {
      console.error("List error:", error);
      let errorMessage = "There was an error listing your tokens";
      if (error instanceof Error) {
        if (error.message.includes("ERC20InsufficientAllowance")) {
          errorMessage = "Approval failed. Please try again.";
        } else if (error.message.includes("ERC20InsufficientBalance")) {
          errorMessage = "Insufficient token balance";
        } else if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was cancelled";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Listing failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsListing(false);
    }
  };

  // Unlist tokens function (creator only - dummy for now)
  const handleUnlistTokens = async () => {
    if (!unlistAmount || Number(unlistAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to unlist",
        variant: "destructive",
      });
      return;
    }

    // For now, just show a coming soon message
    toast({
      title: "Feature coming soon! 🚧",
      description: `Unlisting ${unlistAmount} ${asset?.symbol} tokens - functionality will be added later`,
    });

    // Real implementation would be:
    // try {
    //   const amountInWei = parseEther(unlistAmount);
    //   const tokenAddress = asset.contractAddress;
    //   
    //   const txHash = await writeContractAsync({
    //     address: wagmiContractMarketplaceConfig.address as `0x${string}`,
    //     abi: wagmiContractMarketplaceConfig.abi,
    //     functionName: "removeTokensFromPool",
    //     args: [tokenAddress as `0x${string}`, amountInWei],
    //   });
    //   
    //   setUnlistAmount("");
    // } catch (error) {
    //   // Error handling
    // }
  };

  const { isSuccess: isListSuccess } =
    useWaitForTransactionReceipt({
      hash: listTxHash,
    });

  // Show success message when list transaction is confirmed
  useEffect(() => {
    if (isListSuccess && asset) {
      toast({
        title: "Listing completed! 🎉",
        description: "Your tokens are now available for purchase",
      });
      setIsListing(false);
      // Refresh all data
      refreshAllData();
    }
  }, [isListSuccess, asset, toast, refreshAllData]);

  const handleStake = () => {
    if (!asset) return;
    
    // In a real app, this would call an API to stake the tokens
    console.log("Staking tokens:", stakeAmount);

    // Show success state
    setIsStakingSuccess(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsStakingSuccess(false);
      toast({
        title: "Staking successful!",
        description: `You have staked ${stakeAmount} ${asset.symbol}`,
      });
    }, 3000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-400">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !asset) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-white text-xl mb-2">Asset not found</p>
            <p className="text-gray-400 mb-4">{error || "The requested asset could not be loaded."}</p>
            <Link href="/explore">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                Browse Assets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/explore" className="hover:text-purple-400">
                Explore
              </Link>
              <span>/</span>
              <span>{asset.type}</span>
              <span>/</span>
              <span className="text-white">{asset.name}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white">{asset.name}</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-400">
                <Building className="h-4 w-4" />
                <span>{asset.institution}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl border border-purple-800 bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
            <div className="aspect-video bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center">
              <div className="text-4xl font-bold text-white">
                {asset.symbol}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="w-full border-b border-gray-800 bg-transparent">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="stakers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
              >
                Stakers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Description
                  </h2>
                  <p className="text-gray-400">{asset.description}</p>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Asset Details
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Total Supply</div>
                      <div className="text-lg font-medium text-white">
                        {asset.totalSupply.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">
                        Price per Token
                      </div>
                      <div className="text-lg font-medium text-white">
                        IDRX {asset.priceUsd.toFixed(2)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Available Supply</div>
                      <div className="text-lg font-medium text-white">
                        {asset.availableSupply.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Market Cap</div>
                      <div className="text-lg font-medium text-white">
                        ${asset.marketCap.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Total Staked</div>
                      <div className="text-lg font-medium text-white">
                        {asset.stakedAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 p-4">
                      <div className="text-sm text-gray-400">Annual Yield</div>
                      <div className="text-lg font-medium text-white">
                        {asset.annualYield}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="pt-6">
              <div className="space-y-4">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Official Documents
                </h2>

                {asset.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-800 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <div>
                        <div className="font-medium text-white">{doc.name}</div>
                        <div className="text-sm text-gray-400">
                          Added on {new Date(doc.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-800"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="stakers" className="pt-6">
              <div className="space-y-4">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Top Stakers
                </h2>

                <div className="space-y-4">
                  {asset.topStakers.map((staker, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-800 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900 text-white">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {staker.address.slice(0, 6)}...
                            {staker.address.slice(-4)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {staker.amount.toLocaleString()} tokens
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          ${(staker.amount * asset.priceUsd).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {staker.percentage}% of total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Enhanced Transaction Status */}
          {transactionState.stage !== 'idle' && (
            <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {transactionState.stage === 'pending' && (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                      <div>
                        <div className="font-medium text-white">
                          {transactionState.type === 'approving' && 'Approving IDRX...'}
                          {transactionState.type === 'buying' && 'Processing Purchase...'}
                          {transactionState.type === 'listing' && 'Listing Tokens...'}
                          {transactionState.type === 'staking' && 'Staking Tokens...'}
                        </div>
                        <div className="text-sm text-gray-400">{transactionState.message}</div>
                      </div>
                    </div>
                  )}
                  
                  {transactionState.stage === 'confirmed' && (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-green-400">Transaction Successful!</div>
                        <div className="text-sm text-gray-400">{transactionState.message}</div>
                      </div>
                    </div>
                  )}
                  
                  {transactionState.stage === 'error' && (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-red-500 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-red-400">{transactionState.message}</div>
                        {transactionState.error && (
                          <div className="text-sm text-red-300 mt-1">{transactionState.error}</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {transactionState.stage === 'error' && (
                    <Button
                      onClick={() => setTransactionState({ type: 'idle', stage: 'idle', message: '' })}
                      variant="outline"
                      size="sm"
                      className="border-purple-800 text-purple-400 hover:bg-purple-900/30"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-purple-800 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Buy Tokens</CardTitle>
              <CardDescription>Purchase tokens from the marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Your Balance</span>
                  <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                      {formattedBalance} {asset.symbol}
                  </span>
                    <Button
                      onClick={() => refreshAllData(true)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      disabled={transactionState.stage === 'pending'}
                    >
                      <Loader2 className={`h-3 w-3 ${transactionState.stage === 'pending' ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">IDRX Balance</span>
                  <span className="font-medium text-white">
                    {idrxBalance 
                      ? (Number(idrxBalance) / Math.pow(10, Number(idrxDecimals) || 18)).toFixed(2) 
                      : "0.00"} IDRX
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Pool Status</span>
                  <span className={`font-medium ${poolDetails && (poolDetails as any)[2] ? 'text-green-400' : 'text-red-400'}`}>
                    {poolDetails && (poolDetails as any)[2] ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {poolDetails && (poolDetails as any)[2] && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Available Tokens</span>
                  <span className="font-medium text-white">
                        {((Number((poolDetails as any)[0]) || 0) / Math.pow(10, Number(tokenDecimals) || 18)).toFixed(2)} {asset.symbol}
                  </span>
                </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Pool Price</span>
                      <span className="font-medium text-white">
                        {((Number((poolDetails as any)[1]) || 0) / Math.pow(10, Number(idrxDecimals) || 18)).toFixed(2)} IDRX
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyAmount" className="text-white">
                    Amount to Buy
                  </Label>
                  <div className="relative">
                    <Input
                      id="buyAmount"
                      type="number"
                      placeholder="0"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="pr-16 border-purple-800 bg-black/60 text-white"
                      disabled={transactionState.stage === 'pending'}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-gray-400">{asset.symbol}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-purple-900/20 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Total Cost</span>
                    <span className="font-medium text-white">
                      {buyAmount && poolDetails ? (() => {
                        const tokenDecimalsToUse = Number(tokenDecimals) || 18;
                        const idrxDecimalsToUse = Number(idrxDecimals) || 2;
                        const buyAmountBigInt = parseEther(buyAmount);
                        const poolPrice = BigInt((poolDetails as any)[1]);
                        const totalCost = buyAmountBigInt * poolPrice / BigInt(Math.pow(10, tokenDecimalsToUse));
                        return (Number(totalCost) / Math.pow(10, idrxDecimalsToUse)).toFixed(2);
                      })() : "0.00"} IDRX
                    </span>
                  </div>
                </div>

                <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                      disabled={transactionState.stage === 'pending' || !poolDetails || !(poolDetails as any)[2] || !buyAmount || Number(buyAmount) <= 0}
                      onClick={() => setIsBuyDialogOpen(true)}
                    >
                      {transactionState.stage === 'pending' && (transactionState.type === 'buying' || transactionState.type === 'approving') ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {transactionState.type === 'approving' ? 'Approving...' : 'Processing...'}
                        </>
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-purple-800 bg-black/95">
                    {transactionState.stage === 'pending' && (transactionState.type === 'buying' || transactionState.type === 'approving') ? (
                      // Loading State
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
                        <DialogTitle className="text-white mb-2">
                          {transactionState.type === 'approving' ? 'Approving IDRX...' : 'Processing Purchase...'}
                        </DialogTitle>
                        <DialogDescription>
                          {transactionState.message}
                        </DialogDescription>
                      </div>
                    ) : transactionState.stage === 'error' && transactionState.type === 'buying' ? (
                      // Error State
                      <div className="text-center py-8">
                        <div className="h-8 w-8 rounded-full bg-red-500 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-white font-bold">!</span>
                        </div>
                        <DialogTitle className="text-white mb-2">Purchase Failed</DialogTitle>
                        <DialogDescription className="text-red-300 mb-4">
                          {transactionState.error}
                        </DialogDescription>
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => {
                              setTransactionState({ type: 'idle', stage: 'idle', message: '' });
                              setIsBuyDialogOpen(false);
                            }}
                            variant="outline"
                            className="border-gray-700"
                          >
                            Close
                          </Button>
                          <Button
                            onClick={() => {
                              setTransactionState({ type: 'idle', stage: 'idle', message: '' });
                            }}
                            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    ) : transactionState.stage === 'confirmed' && transactionState.type === 'buying' ? (
                      // Success State
                      <div className="text-center py-8">
                        <div className="h-8 w-8 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <DialogTitle className="text-white mb-2">Purchase Successful!</DialogTitle>
                        <DialogDescription className="text-green-300 mb-4">
                          Your tokens are being processed. This dialog will close automatically.
                        </DialogDescription>
                      </div>
                    ) : (
                      // Normal Confirmation State
                      <>
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Confirm Purchase
                      </DialogTitle>
                      <DialogDescription>
                        You are about to purchase {asset.symbol} tokens from{" "}
                        {asset.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Amount</span>
                        <span className="font-medium text-white">
                          {buyAmount || "0"} {asset.symbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Price per Token</span>
                        <span className="font-medium text-white">
                              {poolDetails ? (
                                `${((Number((poolDetails as any)[1]) || 0) / Math.pow(10, Number(idrxDecimals) || 2)).toFixed(2)} IDRX`
                              ) : (
                                `IDRX ${asset.priceUsd.toFixed(2)}`
                              )}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total</span>
                        <span className="text-lg font-bold text-white">
                              {buyAmount && poolDetails ? (() => {
                                const tokenDecimalsToUse = Number(tokenDecimals) || 18;
                                const idrxDecimalsToUse = Number(idrxDecimals) || 2;
                                const buyAmountBigInt = parseEther(buyAmount);
                                const poolPrice = BigInt((poolDetails as any)[1]);
                                const totalCost = buyAmountBigInt * poolPrice / BigInt(Math.pow(10, tokenDecimalsToUse));
                                return `IDRX ${(Number(totalCost) / Math.pow(10, idrxDecimalsToUse)).toFixed(2)}`;
                              })() : "IDRX 0.00"}
                        </span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                            onClick={() => {
                              setIsBuyDialogOpen(false);
                              setTransactionState({ type: 'idle', stage: 'idle', message: '' });
                            }}
                        variant="outline"
                        className="border-gray-700"
                            disabled={transactionState.stage === 'pending'}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                        onClick={handleBuy}
                            disabled={transactionState.stage === 'pending'}
                      >
                            {transactionState.stage === 'pending' ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Confirm Purchase"
                            )}
                      </Button>
                    </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Creator Controls - Only visible to token creator */}
          {!isCreatorLoading && Boolean(isActualCreator) && (
            <Card className="border-green-800 bg-black/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-white">Creator Controls</CardTitle>
                </div>
                <CardDescription>
                  Manage your token listing in the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Pool Status */}
                  {poolDetails && isValidPoolDetails(poolDetails) && poolDetails[2] ? (
                    <div className="rounded-lg bg-green-900/20 p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Pool Status</span>
                          <span className={`font-medium ${poolDetails[2] ? 'text-green-400' : 'text-gray-400'}`}>
                            {poolDetails[2] ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {poolDetails[2] && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Listed Tokens</span>
                              <span className="font-medium text-white">
                                {((Number(poolDetails[0]) || 0) / Math.pow(10, Number(tokenDecimals) || 18)).toFixed(2)} {asset.symbol}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Pool Price</span>
                              <span className="font-medium text-white">
                                {((Number(poolDetails[1]) || 0) / Math.pow(10, Number(idrxDecimals) || 18)).toFixed(2)} IDRX
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* List Tokens Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">List Tokens for Sale</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="listAmount" className="text-white">
                          Amount to List
                        </Label>
                        <div className="relative">
                          <Input
                            id="listAmount"
                            type="number"
                            placeholder="0"
                            value={listAmount}
                            onChange={(e) => setListAmount(e.target.value)}
                            className="pr-16 border-green-800 bg-black/60 text-white"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-sm text-gray-400">{asset.symbol}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="listPrice" className="text-white">
                          Price per Token (IDRX)
                        </Label>
                        <Input
                          id="listPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={listPrice}
                          onChange={(e) => setListPrice(e.target.value)}
                          className="border-green-800 bg-black/60 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-green-900/20 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Total Value</span>
                        <span className="font-medium text-white">
                          {listAmount && listPrice
                            ? (Number.parseFloat(listAmount) * Number.parseFloat(listPrice)).toFixed(2)
                            : "0.00"} IDRX
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleListTokens}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled={isListing || !listAmount || !listPrice || Number(listAmount) <= 0 || Number(listPrice) <= 0}
                    >
                      {isListing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {currentAllowance && currentAllowance >= parseEther(listAmount || "0") ? "Listing..." : "Approving..."}
                        </>
                      ) : (
                        <>
                          <Store className="mr-2 h-4 w-4" />
                          List Tokens
                        </>
                      )}
                    </Button>
                  </div>

                  <Separator className="bg-gray-800" />

                  {/* Unlist Tokens Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Remove from Marketplace</h3>
                    <div className="space-y-2">
                      <Label htmlFor="unlistAmount" className="text-white">
                        Amount to Unlist
                      </Label>
                      <div className="relative">
                        <Input
                          id="unlistAmount"
                          type="number"
                          placeholder="0"
                          value={unlistAmount}
                          onChange={(e) => setUnlistAmount(e.target.value)}
                          className="pr-16 border-red-800 bg-black/60 text-white"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-sm text-gray-400">{asset.symbol}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleUnlistTokens}
                      variant="destructive"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      disabled={!unlistAmount || Number(unlistAmount) <= 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Unlist Tokens (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-cyan-800 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-white">Stake Tokens</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80">
                        Staking tokens helps validate the asset and provides you
                        with annual yield
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>
                Earn {asset.annualYield}% annual yield
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Staked</span>
                    <span className="font-medium text-white">
                      {asset.stakedAmount.toLocaleString()} {asset.symbol}
                    </span>
                  </div>
                  <Progress
                    value={(asset.stakedAmount / asset.totalSupply) * 100}
                    className="h-2 bg-gray-800"
                  />
                  <div className="mt-1 text-right text-xs text-gray-400">
                    {((asset.stakedAmount / asset.totalSupply) * 100).toFixed(
                      2
                    )}
                    % of total supply
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-cyan-900/20 p-3">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-gray-300">
                    {asset.stakedAmount > asset.totalSupply * 0.5
                      ? "This asset has a high trust level"
                      : "This asset is in the validation process"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stakeAmount" className="text-white">
                    Stake Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="stakeAmount"
                      type="number"
                      placeholder="0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="pr-16 border-cyan-800 bg-black/60 text-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-gray-400">{asset.symbol} </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-cyan-900/20 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Estimated Annual Yield
                    </span>
                    <span className="font-medium text-white">
                      {stakeAmount
                        ? (
                          (Number.parseFloat(stakeAmount) *
                            asset.priceUsd *
                            asset.annualYield) /
                          100
                        ).toFixed(2)
                        : "0.00"}{" "}
                      IDR
                    </span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                      Stake Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-cyan-800 bg-black/95">
                    {isStakingSuccess ? (
                      <TransactionSuccess
                        message="Staking Successful!"
                        subMessage={`You have staked ${stakeAmount} ${asset.symbol}`}
                        onComplete={() => setIsStakingSuccess(false)}
                      />
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Confirm Staking
                          </DialogTitle>
                          <DialogDescription>
                            You are about to stake {asset.symbol} tokens to
                            validate this asset
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Amount</span>
                            <span className="font-medium text-white">
                              {stakeAmount || "0"} {asset.symbol}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Annual Yield</span>
                            <span className="font-medium text-green-400">
                              {asset.annualYield}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Lock Period</span>
                            <span className="font-medium text-white">
                              30 days
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              Estimated Monthly Rewards
                            </span>
                            <span className="text-lg font-bold text-white">
                              {stakeAmount
                                ? (
                                  (Number.parseFloat(stakeAmount) *
                                    asset.priceUsd *
                                    asset.annualYield) /
                                  100 /
                                  12
                                ).toFixed(2)
                                : "0.00"}{" "}
                              IDR
                            </span>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" className="border-gray-700">
                            Cancel
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                            onClick={handleStake}
                          >
                            Confirm Staking
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400">Contract Address</div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm text-white">
                      {asset.contractAddress.slice(0, 18)}...
                      {asset.contractAddress.slice(-4)}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Blockchain</div>
                  <div className="text-white">{asset.blockchain}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Tokenization Date</div>
                  <div className="text-white">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  institution: string;
  description: string;
  totalSupply: number;
  stakedAmount: number;
  priceUsd: number;
  annualYield: number;
  createdAt: string;
  blockchain: string;
  contractAddress: string;
  documents: {
    name: string;
    date: string;
  }[];
  topStakers: {
    address: string;
    amount: number;
  }[];
}

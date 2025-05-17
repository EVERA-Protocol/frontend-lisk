import {
  idrxAbi,
  launchpadAbi,
  marketplaceAbi,
  slasherAbi,
  tokenAbi,
} from "./abi";
import {
  idrxContract,
  RWALaunchpadContract,
  RWAMarketPlaceContract,
  RWATokenContract,
  slasherContract,
} from "./contractAddress";

export const wagmiContractLaunchpadConfig = {
  address: RWALaunchpadContract,
  abi: launchpadAbi,
} as const;

export const wagmiContractTokenConfig = {
  address: RWATokenContract,
  abi: tokenAbi,
} as const;

export const wagmiContractMarketplaceConfig = {
  address: RWAMarketPlaceContract,
  abi: marketplaceAbi,
} as const;

export const wagmiContractSlasherConfig = {
  address: slasherContract,
  abi: slasherAbi,
} as const;

export const wagmiContractIdrxConfig = {
  address: idrxContract,
  abi: idrxAbi,
} as const;

import { launchpadAbi, tokenAbi, yieldAbi, yieldFactoryAbi } from "./abi";
import {
  RWALaunchpadContract,
  RWATokenContract,
  yieldContract,
  yieldFactoryContract,
} from "./contractAddress";

export const wagmiContractLaunchpadConfig = {
  address: RWALaunchpadContract,
  abi: launchpadAbi,
} as const;

export const wagmiContractTokenConfig = {
  address: RWATokenContract,
  abi: tokenAbi,
} as const;

export const wagmiContractYieldConfig = {
  address: yieldContract,
  abi: yieldAbi,
} as const;

export const wagmiContractYieldFactoryConfig = {
  address: yieldFactoryContract,
  abi: yieldFactoryAbi,
} as const;

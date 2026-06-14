import { chainName } from "@/config/chains";
import { Address } from "viem";

export const getLogoTokenDexscreener = (addressToken: Address, chainId: number) =>
  `https://dd.dexscreener.com/ds-data/tokens/${chainName[chainId]}/${addressToken}.png`;

export const getLogoTokenNative = (chainId?: number) => `/tokens/native/${chainId}.png`;

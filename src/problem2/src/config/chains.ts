import { base, Chain } from "wagmi/chains";

export enum ChainId {
  BASE = 8453,
}

export const chainName: { [key: number]: string } = {
  [ChainId.BASE]: "base",
};

export const DEFAULT_CHAIN = base;

export const DEFAULT_CHAIN_ID = DEFAULT_CHAIN?.id;

export const APP_SUPPORTED_CHAINS: [Chain, ...Chain[]] = [DEFAULT_CHAIN];

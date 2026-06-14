import { ChainId } from "./chains";
import { base } from "wagmi/chains";

export const PUBLIC_NODES: Partial<Record<ChainId, readonly string[]>> = {
  [ChainId.BASE]: [
    ...base.rpcUrls.default.http,
    "https://base-mainnet.g.alchemy.com/v2/Oz9YZh30MaH3xHNho9KkR",
    "https://base.drpc.org",
    "https://base.llamarpc.com",
    "https://base-rpc.publicnode.com",
    "https://1rpc.io/base",
    "https://base-public.nodies.app",
  ],
};

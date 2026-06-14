import { APP_SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from "@/config/chains";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export const SUPPORTED_CHAIN_IDS = APP_SUPPORTED_CHAINS.map((c) => c.id);

export const isChainSupported = (chainId?: number) => !!chainId && SUPPORTED_CHAIN_IDS.includes(chainId);

export const useActiveChainId = () => {
  const { chainId, isConnected } = useAccount();

  const activeChainId = useMemo(() => {
    if (isConnected && chainId && isChainSupported(chainId)) return chainId;
    return DEFAULT_CHAIN_ID;
  }, [chainId, isConnected]);

  const isChainSupport = useMemo(() => {
    return activeChainId == chainId;
  }, [activeChainId, chainId]);

  return {
    chainId: activeChainId,
    isChainSupport,
  };
};

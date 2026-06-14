import { useActiveChainId } from "@/hooks/useActiveChainId";
import { NativeCurrency } from "../../packages/swap-sdk-core/nativeCurrency";
import { useMemo } from "react";
import { Native } from "../../packages/swap-sdk-core/native";
import { ChainId, DEFAULT_CHAIN_ID } from "@/config/chains";

export default function useNativeCurrency(overrideChainId?: ChainId): NativeCurrency {
  const { chainId } = useActiveChainId();
  return useMemo(() => {
    try {
      return Native.onChain(overrideChainId ?? chainId ?? DEFAULT_CHAIN_ID);
    } catch (e) {
      return Native.onChain(DEFAULT_CHAIN_ID);
    }
  }, [overrideChainId, chainId]);
}

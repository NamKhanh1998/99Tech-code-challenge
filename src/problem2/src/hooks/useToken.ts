import { useActiveChainId } from "@/hooks/useActiveChainId";
import { ERC20Token } from "../../packages/swap-sdk-core/erc20Token";
import { erc20Abi } from "viem";
import { useReadContracts } from "wagmi";
import { useMemo } from "react";
import { safeGetAddress } from "@/utils/address";

export function useTokenByChainId(tokenAddress?: string, chainId?: number): ERC20Token | undefined | null {
  const address = safeGetAddress(tokenAddress);

  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: "name",
      },
    ],
    query: {
      enabled: Boolean(address),
      staleTime: Infinity,
    },
  });

  return useMemo(() => {
    if (!chainId || !address) return undefined;
    if (isLoading) return null;
    if (data) {
      return new ERC20Token(chainId, address, data[0], data[1] ?? "UNKNOWN", data[2] ?? "Unknown Token");
    }
    return undefined;
  }, [chainId, address, isLoading, data]);
}

export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const { chainId } = useActiveChainId();
  return useTokenByChainId(tokenAddress, chainId);
}

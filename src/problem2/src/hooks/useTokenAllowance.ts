import { erc20Abi } from "viem";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { useActiveChainId } from "./useActiveChainId";
import { Token } from "../../packages/swap-sdk-core/token";
import { CurrencyAmount } from "../../packages/swap-sdk-core/fractions/currencyAmount";
import { publicClient } from "@/utils/viemClients";

function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): {
  allowance: CurrencyAmount<Token> | undefined;
  refetch: () => Promise<QueryObserverResult<bigint>>;
  isLoading: boolean;
} {
  const { chainId } = useActiveChainId();

  return useTokenAllowanceByChainId({
    chainId,
    token,
    owner,
    spender,
  });
}

export function useTokenAllowanceByChainId({
  chainId,
  token,
  owner,
  spender,
}: {
  chainId: number;
  token?: Token;
  owner?: string;
  spender?: string;
}): {
  allowance: CurrencyAmount<Token> | undefined;
  refetch: () => Promise<QueryObserverResult<bigint>>;
  isLoading: boolean;
} {
  const {
    data: allowance,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [chainId, token?.address, owner, spender],

    queryFn: async () => {
      if (!token || !owner || !spender) {
        throw new Error("Missing required parameters");
      }
      return await publicClient({ chainId }).readContract({
        abi: erc20Abi,
        address: token.address,
        functionName: "allowance",
        args: [owner as `0x${string}`, spender as `0x${string}`],
      });
    },

    staleTime: 5000,
    refetchInterval: 10000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: Boolean(spender && owner && token),
  });

  return {
    allowance:
      token && typeof allowance !== "undefined" ? CurrencyAmount.fromRawAmount(token, allowance.toString()) : undefined,
    refetch,
    isLoading,
  };
}

export default useTokenAllowance;

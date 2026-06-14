import { DEFAULT_CHAIN_ID } from "@/config/chains";
import { getViemClients, publicClient } from "@/utils/viemClients";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Address, erc20Abi, isAddress } from "viem";
import { multicall } from "viem/actions";
import { useAccount } from "wagmi";
import { Currency } from "../../../../packages/swap-sdk-core/currency";
import { CurrencyAmount } from "../../../../packages/swap-sdk-core/fractions/currencyAmount";
import { Token } from "../../../../packages/swap-sdk-core/token";
import { useCombineTokenList } from "./useCombineTokenList";

export const useFetchUserBalances = () => {
  const { address: account } = useAccount();
  const tokens = useCombineTokenList();

  const client = useMemo(() => getViemClients({ chainId: DEFAULT_CHAIN_ID }), []);

  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Currency): t is Token => isAddress(t?.wrapped?.address || "")) ?? [],
    [tokens],
  );

  const nativeToken = useMemo(() => validatedTokens.find((t) => (t as Token).isNative), [validatedTokens]);

  const erc20Tokens = useMemo(() => validatedTokens.filter((t) => !(t as Token).isNative), [validatedTokens]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-balances-global", account],
    queryFn: async () => {
      if (!account || validatedTokens.length === 0) return {};

      const balanceMap: Record<string, CurrencyAmount<Currency>> = {};

      // 1. GET NATIVE BALANCE
      if (nativeToken) {
        const raw = await publicClient({
          chainId: DEFAULT_CHAIN_ID,
        }).getBalance({ address: account });

        const key = `native-${DEFAULT_CHAIN_ID}`;

        balanceMap[key] = CurrencyAmount.fromRawAmount(nativeToken, raw.toString());
      }

      // 2. GET ERC20 BALANCES - Batch in chunks to avoid RPC timeouts
      if (erc20Tokens.length > 0) {
        const BATCH_SIZE = 50; // Fetch 50 tokens at a time

        for (let i = 0; i < erc20Tokens.length; i += BATCH_SIZE) {
          const batch = erc20Tokens.slice(i, i + BATCH_SIZE);
          const batchContracts = batch.map((token) => ({
            abi: erc20Abi,
            address: token.wrapped.address as Address,
            functionName: "balanceOf",
            args: [account as Address],
          }));

          const results = await multicall(client, { contracts: batchContracts, allowFailure: true });

          results.forEach((res, index) => {
            const token = batch[index];
            if (!token || !res?.result) return;

            balanceMap[token.wrapped.address.toLowerCase()] = CurrencyAmount.fromRawAmount(
              token,
              res.result.toString(),
            );
          });
        }
      }

      return balanceMap;
    },
    enabled: Boolean(account && validatedTokens.length > 0),
    staleTime: 1000 * 60,
    retry: 3,
  });

  return {
    balancesMap: data,
    isLoading,
    refetch,
  };
};

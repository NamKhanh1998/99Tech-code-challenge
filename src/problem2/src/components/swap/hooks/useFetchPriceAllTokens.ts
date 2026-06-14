import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { getPriceFromDex } from "../utils/getPriceFromDex";
import { useActiveChainId } from "@/hooks/useActiveChainId";
import { tokenPriceAtom } from "../state/price";
import { useCombineTokenList } from "./useCombineTokenList";

export const useFetchPriceAllTokens = () => {
  const { chainId } = useActiveChainId();
  const allTokens = useCombineTokenList();
  const [, setTokenPriceMap] = useAtom(tokenPriceAtom);

  const arrAddress = allTokens?.map((token) => token?.wrapped?.address);

  const { data: tokenPriceMap, isLoading, refetch } = useQuery({
    queryKey: ["token-price", chainId],
    queryFn: async () => {
      const result = await getPriceFromDex(arrAddress, chainId);
      const simplified: Record<string, number | null> = {};
      result.forEach((item) => {
        simplified[item.address] = item.priceUsd;
      });
      setTokenPriceMap((prev) => ({ ...prev, ...simplified }));
      return simplified;
    },
    enabled: arrAddress.length > 0,
    staleTime: 30 * 60_000,
    retry: 1,
    refetchInterval: 30 * 60_000,
  });

  return { tokenPriceMap: tokenPriceMap ?? {}, isLoading, refetch };
};

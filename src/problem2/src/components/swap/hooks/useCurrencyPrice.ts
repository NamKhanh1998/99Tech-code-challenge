import { useActiveChainId } from "@/hooks/useActiveChainId";
import { useAtom } from "jotai";
import { tokenPriceAtom } from "../state/price";
import { useQuery } from "@tanstack/react-query";
import { getPriceFromDex } from "../utils/getPriceFromDex";
import { GELATO_NATIVE, WNATIVE } from "@/config/token";

export const useCurrencyPrice = (address: string) => {
  const { chainId } = useActiveChainId();
  const [tokenPriceMap, setTokenPriceMap] = useAtom(tokenPriceAtom);

  // Handle native token by converting to wrapped token address
  let priceAddress = address;
  if (address.toLowerCase() === GELATO_NATIVE.toLowerCase()) {
    const wrappedToken = WNATIVE[chainId as keyof typeof WNATIVE];
    priceAddress = wrappedToken?.address || address;
  }

  const addrLower = priceAddress.toLowerCase();

  const cachedPrice = tokenPriceMap[addrLower] ?? null;

  // If no price token in atom, call API
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["token-price-single", addrLower, chainId],
    queryFn: async () => {
      const result = await getPriceFromDex([addrLower], chainId);
      const price = result[0]?.priceUsd ?? null;
      const change24h = result[0]?.price24hChange ?? null;
      setTokenPriceMap((prev) => ({ ...prev, [addrLower]: price }));
      return { price, change24h };
    },
    enabled: cachedPrice === null && !!priceAddress,
    staleTime: 60_000,
  });

  const price = cachedPrice ?? data?.price ?? null;
  const change24h = data?.change24h ?? null;

  return { price, change24h, isLoading, refetch };
};

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSwapState } from "../../state";
import { useActiveChainId } from "@/hooks/useActiveChainId";
import { useAccount } from "wagmi";
import { fetchKyberQuote, transformKyberQuote } from "../services/common";
import { SlippageTolerance, useUserSlippage } from "../../state/userSlippage";
import { useCallback, useMemo } from "react";
import { TransformedQuote } from "../types";

export const useAggregatorQuotes = () => {
  const { chainId } = useActiveChainId();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const {
    userSlippage: { slippage, customSlippage },
  } = useUserSlippage();

  const allowedSlippage = useMemo(() => {
    return customSlippage ? customSlippage : slippage === SlippageTolerance.AUTO ? 5 : slippage;
  }, [slippage, customSlippage]);

  const {
    swapState: { inputCurrency, outputCurrency, inputValue },
  } = useSwapState();

  const {
    data: kyberQuote,
    isLoading: kyberQuoteLoading,
    refetch: refetchKyberQuote,
    error: kyberError,
  } = useQuery({
    queryKey: ["kyberQuote", address, chainId, inputCurrency, outputCurrency, inputValue, allowedSlippage],
    queryFn: () => {
      return fetchKyberQuote(chainId, { typedValue: inputValue, inputCurrency, outputCurrency, allowedSlippage });
    },
    enabled: Number(inputValue) > 0 && Boolean(inputCurrency) && Boolean(outputCurrency),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: 10000,
    retry: false,
  });

  const finalQuote = useMemo(() => {
    return transformKyberQuote(
      kyberQuote,
      inputCurrency,
      outputCurrency,
      kyberQuoteLoading,
      Number(allowedSlippage),
    );
  }, [kyberQuote, inputCurrency, outputCurrency, kyberQuoteLoading, Number(allowedSlippage)]);

  const onResetAggregatorData = useCallback(() => {
    queryClient.setQueryData(
      ["kyberQuote", address, chainId, inputCurrency, outputCurrency, inputValue, allowedSlippage],
      null,
    );
  }, [chainId, address, inputCurrency, outputCurrency, inputValue, allowedSlippage, queryClient]);

  return {
    quote: finalQuote as TransformedQuote,
    isLoading: kyberQuoteLoading,
    error: kyberError,
    onResetAggregatorData,
  };
};

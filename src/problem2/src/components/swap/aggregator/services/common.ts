import { ChainId } from "@/config/chains";
import { AggregatorPlatform, KyberQuoteResponse, QuoteRequest } from "../types";
import { isAddress } from "viem";
import BigNumber from "bignumber.js";
import { BIG_TEN, getBalanceAmount } from "../../utils/bigNumber";
import { Currency } from "../../../../../packages/swap-sdk-core/currency";
import { CurrencyAmount } from "../../../../../packages/swap-sdk-core/fractions/currencyAmount";
import { kyberService } from "./kyber";
import { GELATO_NATIVE } from "@/config/token";

const isValidQuoteInput = (typedValue: string, inputCurrency: any, outputCurrency: any): boolean =>
  Number(typedValue) > 0 && Boolean(inputCurrency) && Boolean(outputCurrency);

export const getTokenAddress = (token: any): string =>
  token?.address && isAddress(token?.address) ? token.address : GELATO_NATIVE;

const buildQuoteRequest = (
  chainId: ChainId,
  typedValue: string,
  inputCurrency: any,
  outputCurrency: any,
  allowedSlippage: number,
): QuoteRequest => ({
  chainId,
  inputCurrency: getTokenAddress(inputCurrency),
  outputCurrency: getTokenAddress(outputCurrency),
  amount: new BigNumber(typedValue).times(BIG_TEN.pow(inputCurrency.decimals)).integerValue().toFixed(0),
  allowedSlippage,
});

export const fetchKyberQuote = async (chainId: ChainId, debouncedValues: any): Promise<any> => {
  const { typedValue, inputCurrency, outputCurrency, allowedSlippage } = debouncedValues;

  if (!isValidQuoteInput(typedValue, inputCurrency, outputCurrency)) return null;

  const quoteRequest = buildQuoteRequest(chainId, typedValue, inputCurrency, outputCurrency, allowedSlippage);
  return kyberService.fetchQuote(quoteRequest);
};

export const transformKyberQuote = (
  kyberQuote: KyberQuoteResponse | undefined,
  inputCurrency: Currency,
  outputCurrency: Currency,
  isLoading: boolean,
  allowedSlippage: number,
) => {
  const routeSummary = kyberQuote?.routeSummary;
  const outAmount = getBalanceAmount(routeSummary?.amountOut || "", outputCurrency.decimals);
  const inputParsedAmount = CurrencyAmount.fromRawAmount(inputCurrency, routeSummary?.amountIn || "");
  const outputParsedAmount = CurrencyAmount.fromRawAmount(outputCurrency, routeSummary?.amountOut || "");

  const outAmountDecimals = outAmount.gt(1) ? 6 : 10;
  return {
    inputParsedAmount,
    outputParsedAmount,
    outAmount: !outAmount.isNaN() ? outAmount?.decimalPlaces(outAmountDecimals)?.toString() : "",
    rawInAmount: kyberQuote?.rawInAmount,
    outValue: isLoading ? "" : routeSummary?.amountOutUsd ? new BigNumber(routeSummary?.amountOutUsd!).toString() : "",
    inputCurrency,
    outputCurrency,
    platform: AggregatorPlatform.KYBER,
    routerAddress: kyberQuote?.routerAddress,
    routeSummary,
    allowedSlippage,
  };
};

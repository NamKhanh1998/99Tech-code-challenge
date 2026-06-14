import { ERC20Token } from "../../../../packages/swap-sdk-core/erc20Token";
import { Currency } from "../../../../packages/swap-sdk-core/currency";
import { CurrencyAmount } from "../../../../packages/swap-sdk-core/fractions/currencyAmount";
import { NativeCurrency } from "../../../../packages/swap-sdk-core/nativeCurrency";
import { Token } from "../../../../packages/swap-sdk-core/token";

export interface QuoteRequest {
  chainId: number;
  inputCurrency: string;
  outputCurrency: string;
  amount: string;
  allowedSlippage: number;
}

export enum AggregatorPlatform {
  KYBER = 2,
}

export type KyberRouteSummary = {
  amountIn: string;
  amountInUsd: string;
  amountOut: string;
  amountOutUsd: string;
  gasUsd: string;
  routeID: string;
  tokenIn: string;
  tokenOut: string;
};

export type KyberQuoteResponse = {
  routeSummary: KyberRouteSummary;
  routerAddress: string;
  rawInAmount?: string;
};

export type TransformedQuote = {
  outAmount: string;
  outValue: string;
  rawInAmount?: string;
  inputCurrency: Currency;
  outputCurrency: Currency;
  platform: AggregatorPlatform;
  routerAddress: string | undefined;
  inputParsedAmount: CurrencyAmount<NativeCurrency | Token | ERC20Token> | undefined;
  outputParsedAmount: CurrencyAmount<NativeCurrency | Token | ERC20Token> | undefined;
  routeSummary?: KyberRouteSummary;
  allowedSlippage?: number;
};

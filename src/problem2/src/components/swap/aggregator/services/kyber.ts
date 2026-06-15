import axios from "axios";
import { Address } from "viem/accounts";
import { ChainId } from "@/config/chains";
import { QuoteRequest, TransformedQuote } from "../types";

const BASE_URL = "https://aggregator-api.kyberswap.com/base/api/v1";
const BFF_BASE_URL = "https://bff.kyberswap.com/api/v1";
const FEE_RECEIVER = "0x2d9b4DF9C886dbE42D10D39b25742F0d3f36522a";
const FEE_AMOUNT = 5;

const client = axios.create();

export const fetchQuote = async (inputData: QuoteRequest) => {
  if (!inputData.amount) return null;

  try {
    const params = new URLSearchParams({
      tokenIn: inputData.inputCurrency,
      tokenOut: inputData.outputCurrency,
      amountIn: inputData.amount.toString(),
      chargeFeeBy: "currency_out",
      feeReceiver: FEE_RECEIVER,
      isInBps: "true",
      feeAmount: FEE_AMOUNT.toString(),
      gasInclude: "true",
    });

    const response = await client.get(`${BASE_URL}/routes?${params}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Failed to fetch quote from Kyber:", error);
    return null;
  }
};

const buildQuote = async (account: Address, quoteData: TransformedQuote, chainId: ChainId, recipient?: string) => {
  try {
    const address = recipient || account;
    const requestBody = {
      routeSummary: quoteData?.routeSummary,
      sender: address,
      recipient: address,
      slippageTolerance: Number(quoteData?.allowedSlippage) * 100 || 100, // The unit is bps (1/100 of 1%). The value is in ranges [0, 2000], with 10 meaning 0.1%, and 0.1 meaning 0.001%. If no value is provided, slippageTolerance will be set to 0.
      enableGasEstimation: false,
      skipSimulateTx: false,
      referral: "",
    };

    const response = await client.post(`${BASE_URL}/route/build`, requestBody);
    return response?.data?.data;
  } catch (error) {
    console.error("Failed to build quote from Kyber:", error);
    return null;
  }
};

const getPriceImpact = async (quoteData: TransformedQuote, chainId: ChainId) => {
  const routeSummary = quoteData?.routeSummary;

  const tokenIn = routeSummary?.tokenIn as string;
  const tokenOut = routeSummary?.tokenOut as string;
  const tokenInDecimal = quoteData.inputCurrency?.decimals;
  const tokenOutDecimal = quoteData.outputCurrency?.decimals;

  const amountIn = routeSummary?.amountIn;
  const amountOut = routeSummary?.amountOut;

  if (tokenIn && tokenOut && amountIn && amountOut) {
    const params = new URLSearchParams({
      tokenIn,
      tokenInDecimal: tokenInDecimal?.toString() || "0",
      tokenOut,
      tokenOutDecimal: tokenOutDecimal?.toString() || "0",
      amountIn,
      amountOut,
      chainId: chainId.toString(),
    });

    const response = await client.get(`${BFF_BASE_URL}/price-impact?${params}`);
    return response?.data?.data;
  }

  return null;
};

export const kyberService = {
  fetchQuote,
  buildQuote,
  getPriceImpact,
};

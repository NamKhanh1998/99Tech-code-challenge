import { Currency } from "../../../../packages/swap-sdk-core/currency";

export function escapeRegNumberExp(string: string): string {
  return string.replace(/[,.*+?^${}()|[\]\\]/g, "\\$&");
}

export const inputRegex = RegExp(`^\\d*(\\\\[.,]\\d*)*$`);

export const normalizeInput = (inputValue: string) => {
  const lastIndexIsDecimal =
    inputValue?.length > 0
      ? inputValue[inputValue?.length - 1] === "," || inputValue[inputValue?.length - 1] === "."
      : false;
  const decimalIndex = lastIndexIsDecimal ? inputValue?.length - 1 : inputValue?.indexOf(".");

  if (decimalIndex >= 0) {
    const intergerPart = inputValue?.slice(0, decimalIndex)?.replace(/([,.])/g, "");
    const decimalPart = inputValue?.slice(decimalIndex + 1)?.replace(/([,.])/g, "");
    return `${intergerPart}.${decimalPart}`;
  }

  return inputValue?.replace(/[,.]/g, "");
};

export const displayValueFormatted = (value: string | number) => {
  const decimalParts = value?.toString()?.split(".");

  if (decimalParts?.length < 2) return value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formatedInterger = decimalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatedInterger}.${decimalParts[1]}`;
};

export function filterTokens(tokens: Currency[], search: string): Currency[] {
  if (!search) return tokens;

  const lowerSearchParts = (search as string)
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  if (lowerSearchParts.length === 0) {
    return tokens;
  }

  const matchesSearch = (s?: string): boolean => {
    if (!s) return false;
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0);

    return lowerSearchParts.every(
      (p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p) || sp.includes(p)),
    );
  };

  return tokens.filter(
    (token) =>
      matchesSearch(token.symbol) || matchesSearch(token.name) || (!token.isNative && matchesSearch(token.address)),
  );
}

export const isRejected = (message: string) => {
  return message?.includes("rejected");
};

export const getSwapErrorMessage = (error: any) => {
  const message = error?.message;

  if (isRejected(message)) {
    return "Request Denied";
  }

  return "Swap failed, please increase the slippage and try again.";
};

export const getBalanceKey = (currency: Currency | null | undefined, chainId: number) => {
  if (!currency) return null;
  if (currency.isNative) {
    return `native-${chainId}`;
  }
  return currency.wrapped.address.toLowerCase();
};

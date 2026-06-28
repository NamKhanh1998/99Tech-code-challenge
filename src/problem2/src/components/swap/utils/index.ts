import { Currency } from "../../../../packages/swap-sdk-core/currency";

// We use this function when creating a regular expression from user input.
// Since characters like ., *, +, ?, (, ), and $ have special meanings in regex, we need to escape them first.
// This ensures the input is treated as a literal string rather than a regex pattern, preventing incorrect matches and unexpected behavior.
export function escapeRegNumberExp(string: string): string {
  return string.replace(/[,.*+?^${}()|[\]\\]/g, "\\$&");
}

export const inputRegex = RegExp(`^\\d*(\\\\[.,]\\d*)*$`);

// Converts user-typed number strings (including EU comma decimals and thousand-separator commas) into a canonical dot-decimal string (e.g. "1,500.25" → "1500.25", "1,5" → "1.5").
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

// Formats a raw number for display by adding thousand-separator commas (e.g. 1500.25 → "1,500.25"). Preserves the decimal part as-is.
export const displayValueFormatted = (value: string | number) => {
  const decimalParts = value?.toString()?.split(".");

  if (decimalParts?.length < 2) return value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formatedInterger = decimalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatedInterger}.${decimalParts[1]}`;
};

// Filters a token list by a free-text query, matching against symbol, name, or contract address (case-insensitive, multi-word, substring match).
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

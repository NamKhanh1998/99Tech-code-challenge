import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { Currency } from "../../../../packages/swap-sdk-core/currency";
import { DEFAULT_CHAIN_ID } from "@/config/chains";
import { Native } from "../../../../packages/swap-sdk-core/native";
import { Token } from "../../../../packages/swap-sdk-core/token";

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export enum SearchNarrative {
  DEFAULT = "Default",
  IMPORT = "Import",
}

/** Currency information including metadata and social links */
export interface ICurrency {
  coingeckoId: string;
  symbol: string;
  name: string;
  address: string;
  pairAddress: string;
  decimals: number;
  website: string;
  twitter: string;
  telegram: string;
  logoUrl?: string;
  import?: boolean;
}

/** Swap state containing currencies and their values */
export interface ISwapState {
  inputCurrency: Currency;
  outputCurrency: Currency;
  inputValue: string;
  outputValue: string;
}

const initState: ISwapState = {
  inputCurrency: Native.onChain(DEFAULT_CHAIN_ID),
  outputCurrency: new Token(
    DEFAULT_CHAIN_ID,
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    6,
    "USDC",
    "USD Coin",
    "https://tokens.pancakeswap.finance/images/symbol/usdc.png",
  ),
  inputValue: "",
  outputValue: "",
};

export const swapState = atom<ISwapState>(initState);

/** Hook to access and update swap state */
export const useSwapState = () => {
  const [data, setData] = useAtom(swapState);

  return {
    swapState: data,
    setSwapState: setData,
  };
};

/** Get comparable key for currency (symbol for native, address for wrapped) */
const getCompareKey = (c?: Currency) => {
  if (!c) return undefined;
  return c.isNative ? c.symbol : c.wrapped.address;
};

/** Hook providing handlers for swap interactions */
export const useSwapActionHandler = () => {
  const {
    swapState: { inputCurrency, outputCurrency, outputValue, inputValue },
    setSwapState,
  } = useSwapState();
  const { push, pathname, query } = useRouter();

  /** Get currency identifier for URL (address for tokens, symbol for native) */
  const getCurrencyIdentifier = useCallback((currency: Currency) => {
    if (!currency) return null;
    if (currency.isNative) {
      return currency.symbol;
    }
    return currency.address;
  }, []);

  /** Update URL with current currency selections */
  const updateURLWithCurrencies = useCallback(
    (newInputCurrency?: Currency, newOutputCurrency?: Currency) => {
      const inputId = getCurrencyIdentifier(newInputCurrency || inputCurrency);
      const outputId = getCurrencyIdentifier(newOutputCurrency || outputCurrency);

      if (inputId && outputId) {
        push(
          {
            pathname,
            query: {
              ...query,
              inputCurrencyId: inputId,
              outputCurrencyId: outputId,
            },
          },
          undefined,
          { shallow: true },
        );
      }
    },
    [getCurrencyIdentifier, inputCurrency, outputCurrency, pathname, query, push],
  );

  /** Select a currency for input or output field, auto-switching if needed */
  const onSelectCurrency = useCallback(
    (field: Field, currency: Currency) => {
      const selectedKey = getCompareKey(currency);
      const inputKey = getCompareKey(inputCurrency);
      const outputKey = getCompareKey(outputCurrency);

      if (field === Field.INPUT) {
        if (selectedKey === outputKey) {
          onSwitchCurrencies();
        } else {
          setSwapState((p) => ({ ...p, inputCurrency: currency }));
          updateURLWithCurrencies(currency, outputCurrency);
        }
      }

      if (field === Field.OUTPUT) {
        if (selectedKey === inputKey) {
          onSwitchCurrencies();
        } else {
          setSwapState((p) => ({ ...p, outputCurrency: currency }));
          updateURLWithCurrencies(inputCurrency, currency);
        }
      }
    },
    [inputCurrency, outputCurrency, updateURLWithCurrencies],
  );

  /** Update input value, clearing output when input is cleared */
  const onTypeInput = useCallback((value: string) => {
    if (value) {
      setSwapState((p) => ({
        ...p,
        inputValue: value,
      }));
    } else {
      setSwapState((p) => ({
        ...p,
        inputValue: value,
        outputValue: "",
      }));
    }
  }, []);

  /** Swap input and output currencies, preserving previous output as new input */
  const onSwitchCurrencies = useCallback(() => {
    const oldInputCurrency = inputCurrency;
    const oldOutputCurrency = outputCurrency;
    const oldOutputValue = outputValue;

    setSwapState((p) => ({
      ...p,
      inputCurrency: oldOutputCurrency,
      outputCurrency: oldInputCurrency,
      inputValue: oldOutputValue,
      outputValue: "",
    }));

    updateURLWithCurrencies(oldOutputCurrency, oldInputCurrency);
  }, [inputCurrency, outputCurrency, outputValue, updateURLWithCurrencies]);

  return {
    onSelectCurrency,
    onTypeInput,
    onSwitchCurrencies,
  };
};

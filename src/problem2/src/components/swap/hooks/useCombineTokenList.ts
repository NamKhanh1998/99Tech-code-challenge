import { useMemo } from "react";
import { importedTokensAtom } from "./useManageImportToken";
import { uniqBy } from "lodash";
import { tokensList } from "@/config/tokens/base";
import { Address } from "viem";
import { Token } from "../../../../packages/swap-sdk-core/token";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import { useAtom } from "jotai";

export interface TokenListProps {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoUrl?: string;
}

const mapListToTokens = (list: TokenListProps[]) => {
  return list?.map((item) => {
    return new Token(
      8453, // Base network chainId
      item.address as Address,
      item.decimals,
      item.symbol ?? "",
      item.name ?? "",
      item.logoUrl ?? "",
    );
  });
};

export const useCombineTokenList = () => {
  const native = useNativeCurrency();
  const [importedTokens] = useAtom(importedTokensAtom);

  const defaultTokens = useMemo(() => [...mapListToTokens(tokensList as TokenListProps[])], []);

  const importedTokensMapped = useMemo(() => mapListToTokens(importedTokens as TokenListProps[]), [importedTokens]);

  const swapList = useMemo(() => {
    return uniqBy([native, ...defaultTokens, ...importedTokensMapped], "address");
  }, [native, defaultTokens, importedTokensMapped]);

  return swapList;
};

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import { uniqBy } from "lodash";
import { Token } from "../../../../packages/swap-sdk-core/token";

export const importedTokensAtom = atomWithStorage<Token[]>("users_import_tokens", []);

export const useTokensImport = () => {
  const [tokens, setTokens] = useAtom(importedTokensAtom);

  const onImportToken = useCallback((token: Token) => {
    setTokens((p) => uniqBy([...p, token], "address"));
  }, []);

  const onRemoveToken = useCallback(
    (token: Token) => {
      setTokens((p) => p.filter((_) => _?.address?.toLowerCase() !== token?.wrapped?.address?.toLowerCase()));
    },
    [setTokens],
  );

  return {
    tokens,
    onImportToken,
    onRemoveToken,
  };
};

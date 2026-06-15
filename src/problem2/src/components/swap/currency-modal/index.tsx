import Flex from "@/components/ui/Flex";
import Text from "@/components/ui/Text";
import ModalV2 from "@/components/modal";
import { StyledModalBox } from "@/components/modal/styles";
import useDebounce from "@/hooks/useDebounce";
import { useToken } from "@/hooks/useToken";
import { safeGetAddress } from "@/utils/address";
import CloseIcon from "@mui/icons-material/Close";
import React, { FC, useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Currency } from "../../../../packages/swap-sdk-core/currency";
import { useCombineTokenList } from "../hooks/useCombineTokenList";
import { useFetchUserBalances } from "../hooks/useFetchUserBalances";
import { useTokensImport } from "../hooks/useManageImportToken";
import { Field, SearchNarrative, useSwapActionHandler } from "../state";
import { filterTokens, getBalanceKey } from "../utils";
import CurrencyRow from "./CurrencyRow";
import ImportRow from "./ImportRow";
import { SearchFatIcon } from "@/components/icons/SearchFatIcon";
import { theme } from "@/config";

const ModalHeader = styled(Flex)`
  padding: 16px 24px;
  width: 100%;
  justify-content: space-between;
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: 600;
`;

const IconWrap = styled(Flex)`
  border-radius: 50%;
  padding: 0 5px;
  cursor: pointer;
  transition: all 0.3s;
  color: ${({ theme }) => theme.colors.icon};

  &:hover > svg {
    fill: ${({ theme }) => theme.colors.pureWhite};
  }
`;

const Body = styled(Flex)`
  width: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  background-color: transparent;
  transition: all 0.2s;

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeHolder};
  }
`;

const WrapperSearchInput = styled(Flex)`
  width: 100%;
  height: 44px;
  border-radius: 20px;
  align-items: center;
  padding: 8px 12px;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundSecond};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TokenList = styled(Flex)`
  width: 100%;
  padding: 16px 20px;
  flex-direction: column;
  height: 465px;
  overflow-y: auto;
  gap: 2px;
  padding-bottom: 0px;
  padding-top: 0px;
`;

const Filters = styled(Flex)`
  width: 100%;
  padding: 8px 24px 16px 24px;
  justify-content: flex-start;
  gap: 8px;
`;

const narratives = [
  { name: "Default", value: SearchNarrative.DEFAULT },
  { name: "Import", value: SearchNarrative.IMPORT },
];

const FilterItem = styled(Flex)<{ $isSelected: boolean; $isDisable?: boolean }>`
  padding: 4px 6px;
  color: ${({ theme }) => theme.colors.pureWhite};
  border-radius: 16px;
  cursor: pointer;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  width: 100px;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      border: 1px solid ${theme.colors.orange};
      background-color: ${theme.colors.orangeFade};
    `}

  ${({ $isDisable }) =>
    $isDisable &&
    css`
      border: 1px solid ${theme.colors.borderDisabled};
      background-color: transparent;
      cursor: default;
      &:hover {
        background-color: transparent;
      }
    `}
`;

export const CurrencyModal: FC<{
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  field: Field;
  callBack?: () => void;
}> = ({ open = false, setOpen = () => {}, field, callBack }) => {
  const swapTokensList = useCombineTokenList();
  const { balancesMap, isLoading: isLoadingBalances } = useFetchUserBalances();

  const [searchValue, setSearchValue] = useState("");
  const [selectedNarrative, setSelectedNarrative] = useState(SearchNarrative.DEFAULT);

  const debouncedQuery = useDebounce(searchValue, 300);

  const { onSelectCurrency } = useSwapActionHandler();
  const { tokens: userAddedTokens } = useTokensImport();

  const onSelect = useCallback(
    (currency: Currency) => {
      onSelectCurrency(field, currency);
      setOpen(false);
      setSearchValue("");
    },
    [onSelectCurrency, field],
  );

  const filteredList = useMemo(() => {
    let list = !debouncedQuery ? swapTokensList : filterTokens(swapTokensList, debouncedQuery);

    // Filter by selected narrative (Default or Imported)
    if (selectedNarrative === SearchNarrative.DEFAULT) {
      list = list.filter(
        (token) =>
          !userAddedTokens.some(
            (importedToken) =>
              !token.isNative && importedToken.address.toLowerCase() === token.wrapped.address.toLowerCase(),
          ),
      );
    } else if (selectedNarrative === SearchNarrative.IMPORT) {
      list = list.filter((token) =>
        userAddedTokens.some(
          (importedToken) =>
            !token.isNative && importedToken.address.toLowerCase() === token.wrapped.address.toLowerCase(),
        ),
      );
    }

    // Sort by balance in descending order
    return list.sort((a, b) => {
      const aBalance = a.isNative
        ? balancesMap?.[`native-${a.chainId}`]
        : balancesMap?.[a.wrapped?.address?.toLowerCase()];

      const bBalance = b.isNative
        ? balancesMap?.[`native-${b.chainId}`]
        : balancesMap?.[b.wrapped?.address?.toLowerCase()];

      const aValue = aBalance ? parseFloat(aBalance.toSignificant()) : 0;
      const bValue = bBalance ? parseFloat(bBalance.toSignificant()) : 0;

      return bValue - aValue; // Descending order
    });
  }, [debouncedQuery, swapTokensList, balancesMap, selectedNarrative, userAddedTokens]);

  // Check if search input is a valid address
  const addressFromInput = useMemo(() => {
    return safeGetAddress(debouncedQuery);
  }, [debouncedQuery]);

  // Check if address already exists in the default list
  const addressExistsInList = useMemo(() => {
    if (!addressFromInput) return false;
    return swapTokensList.some(
      (token) => !token.isNative && token.address.toLowerCase() === addressFromInput.toLowerCase(),
    );
  }, [addressFromInput, swapTokensList]);

  // Only fetch from on-chain if address is valid and not in the default list
  const searchToken = useToken(addressFromInput && !addressExistsInList ? addressFromInput.toString() : undefined);

  const { onImportToken } = useTokensImport();

  const isShowImport = useMemo(() => {
    // Only show import if:
    // 1. We found a token from on-chain
    // 2. Input is a valid address (not just symbol/name search)
    // 3. Token is not already in user added tokens
    // 4. Token is not in the filtered list
    return (
      searchToken &&
      addressFromInput &&
      !userAddedTokens.find((token) => searchToken?.equals(token)) &&
      !filteredList.find((token) => searchToken?.equals(token))
    );
  }, [searchToken, addressFromInput, userAddedTokens, filteredList]);

  const onModalClose = () => {
    setOpen(false);
    setSearchValue("");
    callBack?.();
  };

  const handleImportToken = useCallback(() => {
    if (isShowImport && searchToken) {
      onSelect(searchToken);
      onImportToken(searchToken);
      onModalClose();
    }
  }, [isShowImport, onImportToken, onSelect, onModalClose]);

  return (
    <>
      <ModalV2 open={open} callBack={onModalClose}>
        <StyledModalBox>
          <ModalHeader>
            <Title>Select a token</Title>
            <IconWrap onClick={onModalClose}>
              <CloseIcon
                sx={{
                  height: "20px",
                  width: "20px",
                }}
              />
            </IconWrap>
          </ModalHeader>

          <Body>
            <Flex width="100%" padding="0px 8px" mb="8px">
              <WrapperSearchInput>
                <Flex style={{ cursor: "pointer" }}>
                  <SearchFatIcon height={20} width={20} />
                </Flex>
                <Input
                  placeholder="Search by name, symbol or address"
                  spellCheck={false}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e?.target?.value)}
                />
              </WrapperSearchInput>
            </Flex>
          </Body>

          <Filters>
            {narratives?.map((n) => (
              <FilterItem
                key={n.value}
                $isSelected={n.value === selectedNarrative}
                onClick={() => setSelectedNarrative(n.value)}
              >
                <Text
                  fontSize="14px"
                  color={n.value === selectedNarrative ? theme.colors.pureWhite : theme.colors.lightBorder}
                >
                  {n.name}
                </Text>
              </FilterItem>
            ))}
          </Filters>

          <TokenList>
            {isShowImport && searchToken ? (
              <ImportRow token={searchToken} onImportToken={handleImportToken} />
            ) : (
              filteredList?.map((token: Currency) => {
                const balanceKey = getBalanceKey(token, token.chainId);
                return (
                  <CurrencyRow
                    key={token.symbol}
                    token={token}
                    onSelect={onSelect}
                    field={field}
                    importedTokens={userAddedTokens}
                    balance={balanceKey ? balancesMap?.[balanceKey] : undefined}
                    isLoadingBalances={isLoadingBalances}
                  />
                );
              })
            )}
          </TokenList>
        </StyledModalBox>
      </ModalV2>
    </>
  );
};

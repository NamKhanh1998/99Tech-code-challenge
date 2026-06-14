import Flex from "@/components/ui/Flex";
import Text from "@/components/ui/Text";
import CurrencyLogo from "@/components/currency-logo";
import { makeShortAddress } from "@/utils/formatAddress";
import { theme } from "@/config";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Currency } from "../../../../packages/swap-sdk-core/currency";
import { Token } from "../../../../packages/swap-sdk-core/token";
import { useCurrencyPrice } from "../hooks/useCurrencyPrice";
import { useTokensImport } from "../hooks/useManageImportToken";
import { Field, useSwapState } from "../state";
import { CurrencyAmount } from "../../../../packages/swap-sdk-core/fractions/currencyAmount";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Spinner from "@/components/common/Spinner";
import { CopyIcon, Check } from "lucide-react";

interface CurrencyListProps {
  token: Currency;
  onSelect: (currency: Currency) => void;
  field: Field;
  importedTokens?: Token[];
  balance?: CurrencyAmount<Currency>;
  isLoadingBalances?: boolean;
}

const Row = styled(Flex)<{ $isSelected: boolean }>`
  width: 100%;
  padding: 10px 8px;
  cursor: pointer;
  width: 100%;
  border-radius: 16px;
  transition: all 0.2s;
  height: 60px;
  align-items: center;
  justify-content: space-between;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: ${({ theme }) => theme.colors.background};
    `}

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecond};
  }

  &:hover .info-icon {
    opacity: 1;
    pointer-events: auto;
  }
`;

const LogoWrapper = styled(Flex)`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const DeleteIconWrap = styled(Flex)`
  cursor: pointer;
  margin-left: 4px;

  &:hover > svg {
    fill: ${({ theme }) => theme.colors.pureWhite};
  }
`;

const CopyIconWrap = styled(Flex)`
  cursor: pointer;
  margin-left: 4px;
  align-items: center;
  color: ${({ theme }) => theme.colors.iconSubtle};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.pureWhite};
  }
`;

const CurrencyRow = ({
  token,
  onSelect,
  field,
  importedTokens = [],
  balance,
  isLoadingBalances = false,
}: CurrencyListProps) => {
  const {
    swapState: { inputCurrency, outputCurrency },
  } = useSwapState();
  const { onRemoveToken } = useTokensImport();

  // Only fetch price if balance is greater than 0
  const hasBalance = balance ? parseFloat(balance.toSignificant()) > 0 : false;

  const { price: tokenPrice, isLoading: isLoadingPrice } = useCurrencyPrice(hasBalance ? token.wrapped.address : "");

  const displayCurrencyUsd = useMemo(() => {
    if (tokenPrice && balance) {
      const valueBigNum = balance.toSignificant();
      return Number(valueBigNum) * tokenPrice;
    }
    return 0;
  }, [tokenPrice, balance]);

  const selectedToken = field === Field.INPUT ? inputCurrency : outputCurrency;

  const isTokenImported = useMemo(() => {
    return importedTokens.some(
      (importedToken) => !token.isNative && importedToken.address.toLowerCase() === token.wrapped.address.toLowerCase(),
    );
  }, [token, importedTokens]);

  const handleSelect = useCallback(() => {
    onSelect(token);
  }, [onSelect, token]);

  const handleRemoveToken = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      onRemoveToken(token as Token);
    },
    [onRemoveToken, token],
  );

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (token.isNative) return;
      navigator.clipboard.writeText(token.wrapped.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    },
    [token],
  );

  return (
    <Row onClick={handleSelect} $isSelected={selectedToken?.wrapped?.address === token?.wrapped?.address}>
      <Flex alignItems="center">
        <LogoWrapper>
          <CurrencyLogo currency={token} size="30px" />
        </LogoWrapper>

        <Flex ml="8px" flexDirection="column">
          <Flex alignItems="center">
            <Text mr="4px" lineHeight={1} fontSize="14px">
              {token.symbol}
            </Text>
            {isTokenImported && (
              <VerticalAlignBottomIcon
                sx={{
                  height: "16px",
                  width: "16px",
                  color: theme.colors.iconSubtle,
                }}
              />
            )}

            {isTokenImported && (
              <DeleteIconWrap onClick={handleRemoveToken}>
                <DeleteSweepIcon
                  sx={{
                    height: "16px",
                    width: "16px",
                    color: theme.colors.iconSubtle,
                  }}
                />
              </DeleteIconWrap>
            )}
          </Flex>

          {token?.isNative ? (
            <Text fontSize="12px" lineHeight={1} color={theme.colors.textSubtle} mt="6px">
              {token.name}
            </Text>
          ) : (
            <Flex mt="4px">
              <Text fontSize="12px" lineHeight={1} color={theme.colors.textSubtle}>
                {makeShortAddress(token.wrapped.address, 4)}
              </Text>

              <CopyIconWrap onClick={handleCopy}>
                {copied ? (
                  <Check size={12} color={theme.colors.statusGreen} />
                ) : (
                  <CopyIcon size={12} />
                )}
              </CopyIconWrap>
            </Flex>
          )}
        </Flex>
      </Flex>

      <Flex flexDirection="column" alignItems="end">
        {isLoadingBalances ? (
          <Spinner height={16} width={16} strokeW={3} />
        ) : (
          <Text fontSize="14px">{balance?.toSignificant()}</Text>
        )}

        {isLoadingPrice ? (
          <Spinner height={16} width={16} strokeW={3} />
        ) : (
          <Text fontSize="12px" lineHeight={1} color={theme.colors.textSubtle} mt="6px">
            ${displayCurrencyUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
        )}
      </Flex>
    </Row>
  );
};

export default CurrencyRow;

import Flex from "@/components/ui/Flex";
import React, { FC } from "react";
import styled, { css } from "styled-components";
import Text from "@/components/ui/Text";
import { Currency } from "../../../../packages/swap-sdk-core/currency";
import CurrencyLogo from "@/components/currency-logo";
import { theme } from "@/config";

const CurrencyRow = styled(Flex)<{ $isSelected: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  width: 100%;
  border-radius: 8px;
  transition: all 0.2s;
  height: 60px;
  align-items: center;
  justify-content: space-between;

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: ${({ theme }) => theme.colors.backgroundSecond};
    `}

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecond};
  }

  &:hover .info-icon {
    opacity: 1;
    pointer-events: auto;
  }
`;

const ImportBtn = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 2px 16px;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition: all 0.2s;
  background-color: ${({ theme }) => theme.colors.orangeSecondary};
  &:hover {
    transform: scale(1.05);
  }
`;

const ImportRow: FC<{
  token: Currency;
  onImportToken: () => void;
}> = ({ token, onImportToken }) => {
  return (
    <CurrencyRow $isSelected>
      <Flex alignItems="center">
        <CurrencyLogo isUseGradientDot currency={token} />
        <Flex ml="8px" flexDirection="column">
          <Flex alignItems="center">
            <Text lineHeight={1}>{token.symbol}</Text>
          </Flex>
          <Text fontSize="12px" lineHeight={1} color={theme.colors.textSubtle} mt="6px">
            {token.name}
          </Text>
        </Flex>
      </Flex>

      <ImportBtn onClick={onImportToken}>
        <Text fontSize="14px" fontWeight={600}>
          Import
        </Text>
      </ImportBtn>
    </CurrencyRow>
  );
};

export default ImportRow;

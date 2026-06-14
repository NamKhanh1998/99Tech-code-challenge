import React, { FC } from "react";
import Flex from "../ui/Flex";
import styled from "styled-components";
import Text from "../ui/Text";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CurrencyModal } from "./currency-modal";
import { Field } from "./state";
import CurrencyLogo from "../currency-logo";
import { Currency } from "../../../packages/swap-sdk-core/currency";
import { useModal } from "../modal/hooks/useModal";
import { theme } from "@/config";

const SelectButton = styled(Flex)`
  border-radius: 20px;
  padding: 4px 8px;
  align-items: center;
  width: auto;
  height: 38px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.borderHover};
  }
`;

const Symbol = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  margin-left: 6px;
`;

const TokenSelectButton: FC<{
  currency: Currency;
  field: Field;
}> = ({ currency, field }) => {
  const [onOpen, , modal] = useModal(<CurrencyModal field={field} />);

  return (
    <>
      <Flex alignItems="center" width="100px">
        <SelectButton onClick={onOpen}>
          <CurrencyLogo currency={currency} size="22px" />
          <Symbol ml="4px">{currency?.symbol}</Symbol>
          <KeyboardArrowDownIcon
            sx={{
              height: 16,
              width: 16,
              color: theme.colors.pureWhite,
            }}
          />
        </SelectButton>
      </Flex>

      {modal}
    </>
  );
};

export default TokenSelectButton;

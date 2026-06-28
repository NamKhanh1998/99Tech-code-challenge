import React, { FC, useCallback } from "react";
import styled from "styled-components";
import Flex from "../ui/Flex";
import Text from "../ui/Text";
import { displayValueFormatted, escapeRegNumberExp, inputRegex, normalizeInput } from "./utils";
import BalanceIcon from "../icons/BalanceIcon";
import TokenSelectButton from "./TokenSelectButton";
import { Field, useSwapActionHandler } from "./state";
import { devices, theme } from "@/config";
import { Currency } from "../../../packages/swap-sdk-core/currency";
import { useAccount } from "wagmi";
import Spinner from "../common/Spinner";

const StyledInputPanel = styled(Flex)`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundSecond};
  padding: 12px;
  position: relative;
  width: 100%;
  flex-direction: column;
  transition: all 0.2s;

  &:focus-within {
    box-shadow: 0px 0px 3px 0px ${({ theme }) => theme.colors.backgroundSecond};
  }
`;

const PanelText = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const PanelContent = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
`;

const StyledInput = styled.input<{
  fontSize?: string;
  align?: string;
}>`
  position: relative;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  text-align: ${({ align }) => align ?? "right"};
  padding: 0;
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
  width: 100%;
  height: 32px;
  text-overflow: ellipsis;
  font-size: 22px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeHolder};
  }

  &:disabled {
    opacity: 1 !important;
    color: ${({ theme }) => theme.colors.white};
    -webkit-text-fill-color: inherit;
    background-color: inherit;
  }

  @media ${devices.tablet} {
    font-size: 24px;
    font-weight: 600;
  }
`;

const ValueWrap = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  margin-top: 8px;
  height: 16px;
`;

const SubText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
`;

const PanelHeader = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  margin-bottom: 8px;
`;

const PercentWrap = styled(Flex)`
  justify-content: flex-end;
`;

const PercentBtn = styled(Flex)`
  height: 20px;
  padding: 0 6px;
  border-radius: 4px;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.textSubtle};
  &:hover {
    color: ${theme.colors.orange};
  }
  cursor: pointer;
`;

const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`;

const BalanceWrap = styled(Flex)`
  cursor: pointer;
  opacity: 1;
`;

const Percents = [
  {
    text: "Half",
    value: 50,
  },
  {
    text: "Max",
    value: 100,
  },
];

const InputPanel: FC<{
  currency: Currency;
  field: Field;
  value: string;
  currencyBalance: string;
  maxBalance?: string;
  valueInUsd?: string;
  isLoading?: boolean;
  isBalanceLoading?: boolean;
}> = ({ currency, field, value, currencyBalance, maxBalance, valueInUsd, isLoading, isBalanceLoading }) => {
  const isInput = field === Field.INPUT;

  const { onTypeInput } = useSwapActionHandler();

  const { address: account } = useAccount();

  const enforcer = (nextUserInput: string) => {
    if (!isInput) return;

    const escapedInput = escapeRegNumberExp(nextUserInput);

    if (nextUserInput === "" || inputRegex.test(escapedInput)) {
      const rawValue = normalizeInput(nextUserInput);
      onTypeInput(rawValue);
    }
  };

  const onFastInput = useCallback(
    (percent: number) => {
      if (!isInput || !currencyBalance) return;

      if (percent === 100) {
        onTypeInput(maxBalance ?? currencyBalance);
        return;
      }

      const balance = parseFloat(currencyBalance);
      if (isNaN(balance) || balance === 0) return;

      const amount = (balance * percent) / 100;
      const amountStr = amount.toString();
      onTypeInput(amountStr);
    },
    [isInput, currencyBalance, maxBalance, onTypeInput],
  );

  return (
    <StyledInputPanel>
      <PanelHeader>
        <PanelText>{isInput ? "From" : "To"}</PanelText>

        {isInput && (
          <PercentWrap>
            {Percents?.map((p) => (
              <PercentBtn key={p.value} onClick={() => onFastInput(p.value)}>
                {p.text}
              </PercentBtn>
            ))}
          </PercentWrap>
        )}
      </PanelHeader>

      <PanelContent>
        <TokenSelectButton currency={currency} field={field} />

        {isLoading ? (
          <Spinner height={28} width={28} strokeW={5} />
        ) : (
          <StyledInput
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder={"0.0"}
            minLength={1}
            maxLength={79}
            spellCheck="false"
            disabled={!isInput}
            value={displayValueFormatted(value)}
            onChange={(event) => {
              enforcer(event.target.value);
            }}
          />
        )}
      </PanelContent>

      <ValueWrap>
        <BalanceWrap
          alignItems="center"
          onClick={() => {
            if (isInput) onFastInput(100);
          }}
        >
          {account && (
            <>
              <BalanceIcon fill={theme.colors.iconSubtle} />
              {isBalanceLoading ? (
                <SubText ml="4px">
                  <Dots />
                </SubText>
              ) : (
                <SubText ml="4px">{displayValueFormatted(currencyBalance)}</SubText>
              )}
            </>
          )}
        </BalanceWrap>
        <Flex>
          {isLoading ? (
            <SubText>
              <Dots />
            </SubText>
          ) : (
            <SubText>{valueInUsd && value ? `${valueInUsd} USD` : ""}</SubText>
          )}
        </Flex>
      </ValueWrap>
    </StyledInputPanel>
  );
};

export default InputPanel;

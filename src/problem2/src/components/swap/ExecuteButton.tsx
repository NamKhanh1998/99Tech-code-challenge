import React, { FC, useMemo } from "react";
import styled, { css } from "styled-components";
import Flex from "../ui/Flex";
import { useSwapActionState } from "./state/swapActionState";
import { TransformedQuote } from "./aggregator/types";
import ConnectWalletButton from "../wallet-connect/ConnectWalletButton";
import Box from "../ui/Box";
import { useAccount } from "wagmi";
import { useSwapState } from "./state";
import { useFetchUserBalances } from "./hooks/useFetchUserBalances";
import { DEFAULT_CHAIN_ID } from "@/config/chains";
import { useApproveCallback, ApprovalState } from "@/hooks/useApproveCallback";
import { useExecuteSwap } from "./aggregator/hooks/useExecuteSwap";
import { useWrongNetwork } from "@/hooks/useWrongNetwork";

const ExecuteBtn = styled(Flex)<{ $disable: boolean }>`
  width: 100%;
  align-items: center;
  border: 0px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  height: 40px;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black};

  &:hover {
    transform: scale(1.005);
  }

  ${({ $disable }) =>
    $disable &&
    css`
      background-color: ${({ theme }) => theme.colors.backgroundThird};
      cursor: default;
      color: ${({ theme }) => theme.colors.black};

      &:hover {
        transform: scale(1);
        opacity: 1;
      }
    `}
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

const ExecuteButton: FC<{
  isLoading: boolean;
  value: string;
  quote: TransformedQuote | undefined | null;
  error: any;
}> = ({ isLoading, value: inputValue, quote, error }) => {
  const {
    swapActionState: { showConfirmModal },
    setSwapActionstate,
  } = useSwapActionState();

  const { address: account } = useAccount();
  const { isWrongNetwork, switchToSupportedNetwork, isSwitching } = useWrongNetwork();

  const {
    swapState: { inputCurrency },
  } = useSwapState();

  const { balancesMap } = useFetchUserBalances();
  const { executeSwap } = useExecuteSwap(quote);

  const currencyBalance = useMemo(() => {
    if (!balancesMap || !inputCurrency) return "0";
    const key = inputCurrency.isNative ? `native-${DEFAULT_CHAIN_ID}` : inputCurrency.wrapped.address.toLowerCase();
    return balancesMap?.[key]?.toExact() || "0";
  }, [balancesMap, inputCurrency]);

  const isDisable = useMemo(() => {
    return (
      isLoading ||
      error ||
      !Number(inputValue) ||
      Number(inputValue) > Number(currencyBalance) ||
      !quote ||
      !quote?.outAmount ||
      isWrongNetwork
    );
  }, [isLoading, inputValue, currencyBalance, quote, error, isWrongNetwork]);

  const isInsufficient = Number(inputValue) > Number(currencyBalance);

  const {
    approvalState,
    approveCallback,
    isPending: isApprovePending,
    isAllowanceLoading,
  } = useApproveCallback(quote?.inputParsedAmount, quote?.routerAddress);

  const needsApproval = approvalState === ApprovalState.NOT_APPROVED;
  const isApproving = approvalState === ApprovalState.PENDING;

  const onApprove = async () => {
    try {
      await approveCallback();
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const onSwap = async () => {
    if (!isDisable && !showConfirmModal && quote) {
      setSwapActionstate((p) => ({
        ...p,
        showConfirmModal: true,
      }));
      await executeSwap();
    }
  };

  if (!account) {
    return (
      <Box width="100%">
        <ConnectWalletButton />
      </Box>
    );
  }

  if (isWrongNetwork) {
    if (isSwitching) {
      return (
        <ExecuteBtn $disable>
          <Dots>Switching</Dots>
        </ExecuteBtn>
      );
    }
    return (
      <ExecuteBtn $disable={false} onClick={switchToSupportedNetwork}>
        Switch to Base
      </ExecuteBtn>
    );
  }

  if (Number(inputValue) === 0 || !inputValue) {
    return <ExecuteBtn $disable>Enter an amount</ExecuteBtn>;
  }

  if (error) {
    return <ExecuteBtn $disable>Error when fetch quote</ExecuteBtn>;
  }

  if (isInsufficient) {
    return <ExecuteBtn $disable>Insufficient amount</ExecuteBtn>;
  }

  if (isLoading || (Boolean(Number(inputValue || 0)) && !quote)) {
    return (
      <ExecuteBtn $disable>
        <Dots>Loading</Dots>
      </ExecuteBtn>
    );
  }

  if (isAllowanceLoading) {
    return (
      <ExecuteBtn $disable>
        <Dots>Loading</Dots>
      </ExecuteBtn>
    );
  }

  if (isApproving || isApprovePending) {
    return (
      <ExecuteBtn $disable>
        <Dots>Approving</Dots>
      </ExecuteBtn>
    );
  }

  if (needsApproval) {
    return (
      <ExecuteBtn $disable={false} onClick={onApprove}>
        Approve {inputCurrency?.symbol || "token"}
      </ExecuteBtn>
    );
  }

  if (showConfirmModal) {
    return (
      <ExecuteBtn $disable={false}>
        <Dots>Confirm in wallet</Dots>
      </ExecuteBtn>
    );
  }

  return (
    <>
      <ExecuteBtn $disable={isDisable} onClick={onSwap}>
        Swap
      </ExecuteBtn>
    </>
  );
};

export default ExecuteButton;

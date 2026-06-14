import ModalV2 from "@/components/modal";
import React, { FC, useMemo, useCallback } from "react";
import { useSwapActionState } from "../state/swapActionState";
import { ModalContainer } from "@/components/modal/styles";
import styled from "styled-components";
import { devices, theme } from "@/config";
import Flex from "@/components/ui/Flex";
import Text from "@/components/ui/Text";
import { poppins } from "@/styles/fonts";
import { useSwapState } from "../state";
import BigNumber from "bignumber.js";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AnimatedCheckmark from "@/components/common/AnimatedCheckmark";
import EastIcon from "@mui/icons-material/East";
import { TransformedQuote } from "../aggregator/types";
import Image from "next/image";
import LogoImg from "@/public/logo/small.png";
import { isRejected } from "../utils";

const StyledModalContainer = styled(ModalContainer)`
  width: calc(100vw - 10px) !important;
  display: flex;
  align-items: center;
  @media ${devices.mobileL} {
    width: 440px !important;
  }
`;

const Body = styled(Flex)`
  width: 100%;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LinkText = styled(Text)`
  font-size: 12px;
  margin-top: 15px;
  color: ${theme.colors.orange};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoLoadingWrapper = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 90px;
    height: 90px;
    border: 3px solid transparent;
    border-top-color: ${theme.colors.orange};
    border-right-color: ${theme.colors.orange};
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ERROR_ICON_COLOR = theme.colors.textMuted;
const SECONDARY_TEXT_COLOR = theme.colors.textMuted;

const formatTokenAmount = (value: string | number, decimals = 6): string => {
  return new BigNumber(value).decimalPlaces(decimals).toString();
};

const ConfirmTxModal: FC<{ quote: TransformedQuote }> = ({ quote }) => {
  const {
    setSwapActionstate,
    swapActionState: { showConfirmModal, attemptingTxn, swapErrorMessage, txHash },
  } = useSwapActionState();

  const {
    swapState: { inputCurrency, outputCurrency, inputValue, outputValue },
  } = useSwapState();

  const callBack = useCallback(() => {
    setSwapActionstate({
      showConfirmModal: false,
      attemptingTxn: false,
      txHash: undefined,
      swapErrorMessage: undefined,
    });
  }, [setSwapActionstate]);

  const confirmText = useMemo(() => {
    return `Swapping ${formatTokenAmount(inputValue)} ${inputCurrency.symbol?.toUpperCase()} for ${formatTokenAmount(quote?.outAmount)} ${outputCurrency.symbol?.toUpperCase()}`;
  }, [inputCurrency, outputCurrency, inputValue, quote]);

  const swapDetails = useMemo(
    () => [
      { currency: inputCurrency, value: inputValue },
      { currency: outputCurrency, value: quote.outAmount },
    ],
    [inputCurrency, outputCurrency, inputValue, quote.outAmount],
  );

  return (
    <ModalV2 open={showConfirmModal} callBack={callBack}>
      <StyledModalContainer $minHeight="300px" className={poppins.className}>
        <Body>
          {attemptingTxn ? (
            <>
              <Text fontSize="20px" fontWeight={500}>
                Waiting For Confirmation
              </Text>
              <Flex padding="20px 0">
                <LogoLoadingWrapper>
                  <Image src={LogoImg} alt="Logo" width={60} height={40} priority />
                </LogoLoadingWrapper>
              </Flex>

              <Text fontSize="14px" color={theme.colors.textSubtle} textAlign="center">
                {confirmText}
              </Text>

              <Text mt="10px" color={theme.colors.textSubtle} fontSize="12px">
                Confirm this transaction in your wallet
              </Text>
            </>
          ) : swapErrorMessage ? (
            <>
              <Flex>
                <ErrorOutlineIcon
                  sx={{
                    height: "80px",
                    width: "80px",
                    color: ERROR_ICON_COLOR,
                  }}
                />
              </Flex>
              <Text mt="10px" color={SECONDARY_TEXT_COLOR} textAlign="center">
                {isRejected(swapErrorMessage) ? "User Rejected" : "Tx fail"}
              </Text>

              {swapErrorMessage?.includes("denied") && (
                <Text mt="10px" color={theme.colors.textSubtle} fontSize="12px" textAlign="center">
                  It seems like you denied the request on the wallet.
                </Text>
              )}
            </>
          ) : txHash ? (
            <Flex flexDirection="column" mt="20px" alignItems="center">
              <AnimatedCheckmark color={theme.colors.orange} />

              <Text mt="10px">Swap Completed</Text>

              <Flex
                alignItems="center"
                mt="16px"
                style={{
                  gap: "4px",
                }}
              >
                {swapDetails.map(({ currency, value }, index) => (
                  <React.Fragment key={index}>
                    <Text fontSize="14px" color={SECONDARY_TEXT_COLOR}>
                      {formatTokenAmount(value)} {currency?.symbol?.toUpperCase()}
                    </Text>

                    {index === 0 && (
                      <EastIcon
                        sx={{
                          height: "14px",
                          width: "14px",
                          color: "gray",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Flex>

              <LinkText
                onClick={() => {
                  window.open(`https://basescan.org/tx/${txHash}`);
                }}
              >
                View on Explorer ↗
              </LinkText>
            </Flex>
          ) : null}
        </Body>
      </StyledModalContainer>
    </ModalV2>
  );
};

export default ConfirmTxModal;

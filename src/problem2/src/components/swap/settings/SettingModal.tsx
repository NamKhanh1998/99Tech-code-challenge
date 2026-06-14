import Flex from "@/components/ui/Flex";
import Text from "@/components/ui/Text";
import ModalV2 from "@/components/modal";
import { ModalContainer } from "@/components/modal/styles";
import { devices, theme } from "@/config";
import React, { FC } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import LandslideIcon from "@mui/icons-material/Landslide";
import { SlippageTolerance, useUserSlippage } from "../state/userSlippage";
import { displayValueFormatted, escapeRegNumberExp, inputRegex, normalizeInput } from "../utils";

const StyledModalContainer = styled(ModalContainer)`
  width: 100%;
  max-width: calc(100vw - 10px) !important;

  @media ${devices.mobileL} {
    max-width: 460px !important;
    height: auto;
  }
`;

const ModalHeader = styled(Flex)`
  padding: 16px;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: 600;
`;

const IconWrap = styled(Flex)`
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  transition: all 0.3s;
  color: ${({ theme }) => theme.colors.icon};
  &:hover > svg {
    fill: ${({ theme }) => theme.colors.pureWhite};
  }
`;

const Body = styled(Flex)`
  width: 100%;
  padding: 16px;
  flex-direction: column;
`;

const SlippageBar = styled(Flex)`
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 5px;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 4px;
`;

const Slippage = styled(Flex)<{ isCustom?: boolean }>`
  padding: 8px 0px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  width: 100%;
  justify-content: center;
  height: 34px;
  border: 1px solid transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ isCustom, theme }) => (isCustom ? "none" : theme.colors.orangeSecondary)};
  }

  &:focus-within {
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const StyledInput = styled.input<{
  error?: boolean;
  fontSize?: string;
  align?: string;
}>`
  position: relative;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  text-align: ${({ align }) => align ?? "right"};
  white-space: nowrap;
  padding: 0px;
  font-size: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeHolder};
  }
`;

const SlippageItems = [SlippageTolerance.AUTO, SlippageTolerance.ONE, SlippageTolerance.THREE, SlippageTolerance.FIVE];

const SettingModal: FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const {
    userSlippage: { slippage, customSlippage },
    setUserSlippage,
  } = useUserSlippage();

  const enforcer = (nextUserInput: string) => {
    const escapedInput = escapeRegNumberExp(nextUserInput);

    if (nextUserInput === "" || inputRegex.test(escapedInput)) {
      const rawValue = normalizeInput(nextUserInput);

      const ajustedValue = Number(rawValue) >= 70 ? "70" : rawValue;

      setUserSlippage((p) => ({
        slippage: SlippageTolerance.AUTO,
        customSlippage: ajustedValue,
      }));
    }
  };

  return (
    <ModalV2 open={open} setOpen={setOpen}>
      <StyledModalContainer $minHeight="100px">
        <ModalHeader>
          <Title>Settings</Title>

          <IconWrap onClick={() => setOpen(false)}>
            <CloseIcon
              sx={{
                height: "20px",
                width: "20px",
              }}
            />
          </IconWrap>
        </ModalHeader>
        <Body>
          <Flex width="100%" justifyContent="space-between">
            <Flex>
              <LandslideIcon
                sx={{
                  color: theme.colors.pureWhite,
                  height: "20px",
                  width: "20px",
                }}
              />
              <Text ml="6px">Max Slippage</Text>
            </Flex>

            <Flex>
              {customSlippage ? (
                <Text>{customSlippage}%</Text>
              ) : (
                <Text>{slippage === SlippageTolerance.AUTO ? slippage : `${slippage}%`}</Text>
              )}
            </Flex>
          </Flex>

          <SlippageBar mt="16px">
            {SlippageItems?.map((item) => (
              <Slippage
                key={item}
                onClick={() =>
                  setUserSlippage((p) => ({
                    slippage: item,
                    customSlippage: "",
                  }))
                }
              >
                {item === SlippageTolerance.AUTO ? item : `${item}%`}
              </Slippage>
            ))}

            <Slippage isCustom>
              <StyledInput
                placeholder="Custom"
                align="center"
                value={customSlippage ? displayValueFormatted(customSlippage) : ""}
                onChange={(event) => {
                  enforcer(event.target.value);
                }}
              />
            </Slippage>
          </SlippageBar>

          <Text mt="12px" fontSize="12px" color="gray">
            Low slippage tolerance may cause transaction failures due to market fluctuations. We recommend setting
            slippage to <strong>AUTO</strong> for smoother execution
          </Text>
        </Body>
      </StyledModalContainer>
    </ModalV2>
  );
};

export default SettingModal;

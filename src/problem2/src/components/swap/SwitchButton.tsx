import React from "react";
import styled from "styled-components";
import Flex from "../ui/Flex";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useSwapActionHandler } from "./state";
import { theme } from "@/config";

const StyledSwitchBtn = styled(Flex)`
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.black};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  border-radius: 50%;
  margin: -20px auto;
  position: relative;
  z-index: 1;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: rotate(360deg);
    opacity: 0.8;
  }
`;

const SwitchButton = () => {
  const { onSwitchCurrencies } = useSwapActionHandler();
  return (
    <StyledSwitchBtn onClick={onSwitchCurrencies}>
      <SwapVertIcon
        sx={{
          color: theme.colors.white,
          height: "20px",
          width: "20px",
        }}
      />
    </StyledSwitchBtn>
  );
};

export default SwitchButton;

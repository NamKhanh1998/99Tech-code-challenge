import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { devices, theme } from "@/config";

export const ModalContainer = styled(motion.div)<{
  $minHeight: string;
  $positionBottomOnMb?: boolean;
  $maxWidth?: string;
  $paddingBottom?: string;
}>`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  box-shadow:
    0px 20px 36px -8px ${({ theme }) => theme.colors.shadowPrimary},
    0px 1px 1px ${({ theme }) => theme.colors.shadowSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  max-height: calc(var(--vh, 1vh) * 100);
  z-index: 100;
  max-width: ${({ $maxWidth }) => $maxWidth || "none"};
  min-height: ${({ $minHeight }) => $minHeight};
  width: auto;
  position: auto;
  bottom: auto;
  padding-bottom: ${({ $paddingBottom }) => $paddingBottom || "0"};
  will-change: transform;

  ${({ $positionBottomOnMb }) =>
    $positionBottomOnMb &&
    css`
      width: 100%;
      bottom: 0;
      position: absolute;
      border-radius: 16px 16px 0px 0px;
      border-bottom: none;
    `}

  @media ${devices.mobileL} {
    width: auto;
    position: auto;
    bottom: auto;
    border-radius: 16px;
    max-height: 100vh;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const StyledModalWrapper = styled(motion.div)`
  position: fixed;
  inset: 0; /* top:0; right:0; bottom:0; left:0; – shorter & modern */
  display: flex;
  align-items: end; /* vertical center */
  justify-content: center; /* horizontal center */

  /* Important stacking order */
  z-index: ${theme.zIndex.modalContent || 1000};

  /* Allow clicks to pass through empty space (so overlay can receive clicks) */
  pointer-events: none;

  /* Performance */
  will-change: opacity;

  /* Ensure children (Overlay + modal content) can receive pointer events */
  > * {
    pointer-events: auto;
  }

  @media ${devices.tablet} {
    align-items: center;
  }
`;

export const StyledModalBox = styled.div<{
  $padding?: string;
  $borderRadius?: string;
  $width?: string;
  $maxWidth?: string;
  $height?: string;
  $maxHeight?: string;
  $backgroundColor?: string;
  $boxShadow?: string;
  $border?: string;
  $zIndex?: number;
}>`
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width || "calc(100vw - 10px)"};
  max-width: ${({ $maxWidth }) => $maxWidth || "none"};
  height: ${({ $height }) => $height || "auto"};
  max-height: ${({ $maxHeight }) => $maxHeight || "calc(1vh * 100)"};
  padding: ${({ $padding }) => $padding || "0px"};
  overflow: hidden;
  background: ${({ $backgroundColor, theme }) => $backgroundColor || theme.colors.background};
  border: ${({ $border, theme }) => $border || `1px solid ${theme.colors.border}`};
  border-radius: 16px 16px 0px 0px;
  border-bottom: none;
  box-shadow: ${({ $boxShadow }) =>
    $boxShadow ||
    `0px 20px 36px -8px ${theme.colors.shadowPrimary}, 0px 1px 1px ${theme.colors.shadowSecondary}`};
  z-index: ${({ $zIndex }) => $zIndex || 100};
  padding-bottom: 16px;
  @media ${devices.mobileL} {
    width: 460px;
    min-width: 460px;
  }

  @media ${devices.tablet} {
    border-radius: ${({ $borderRadius }) => $borderRadius || "16px"};
    border-bottom: ${({ $border, theme }) => $border || `1px solid ${theme.colors.border}`};
  }
`;

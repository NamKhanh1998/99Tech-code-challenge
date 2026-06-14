import { theme } from "@/config";
import { FC } from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const Loader = styled.div<{
  width?: number;
  height?: number;
  strokeW?: number;
}>`
  width: ${(props) => `${props?.width}px` || "50px"};
  height: ${(props) => `${props?.height}px` || "50px"};
  padding: ${(props) => `${props?.strokeW}px` || "6px"};
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${theme.colors.backgroundThird};
  --_m: conic-gradient(transparent 10%, ${theme.colors.black}), linear-gradient(${theme.colors.black} 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: ${rotate} 1s infinite linear;
`;

const Spinner: FC<{
  width?: number;
  height?: number;
  strokeW?: number;
}> = ({ width, height, strokeW }) => (
  <div>
    <Loader width={width} height={height} strokeW={strokeW} />
  </div>
);

export default Spinner;

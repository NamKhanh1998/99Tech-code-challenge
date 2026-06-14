import { HTMLAttributes } from "react";
import {
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
  GridProps as _GridProps,
} from "styled-system";

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    HTMLAttributes<HTMLDivElement> {}

export interface FlexProps extends BoxProps, FlexboxProps {}
export interface TextProps extends SpaceProps, TypographyProps, LayoutProps {
  color?: string;
  fontSize?: string;
  bold?: boolean;
  small?: boolean;
  ellipsis?: boolean;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}

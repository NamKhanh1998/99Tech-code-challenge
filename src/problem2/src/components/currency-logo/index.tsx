import { useMemo, useState } from "react";
import { styled } from "styled-components";
import { getLogoTokenDexscreener, getLogoTokenNative } from "./utils";
import { Currency } from "../../../packages/swap-sdk-core/currency";

const BAD_SRCS: Record<string, true> = {};

interface LogoProps {
  currency?: Currency;
  url?: string;
  size?: string;
  style?: React.CSSProperties;
  isUseGradientDot?: boolean;
  className?: string;
}

const StyledImg = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`;

const Placeholder = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundLogo};
  flex-shrink: 0;
`;

export default function CurrencyLogo({ currency, url, size = "24px", style, className }: LogoProps) {
  const [, refresh] = useState(0);

  const srcs = useMemo(() => {
    if (url) return [url];
    if (!currency) return [];
    if (currency.isNative) return [getLogoTokenNative(currency.chainId)];
    if (currency.logoURI) return [currency.logoURI];
    if (currency.wrapped?.address) return [getLogoTokenDexscreener(currency.wrapped.address, currency.chainId)];
    return [];
  }, [url, currency?.isNative, currency?.wrapped?.address, currency?.chainId, currency?.logoURI]);

  const src = srcs.find((s) => !BAD_SRCS[s]);

  if (!src) {
    return <Placeholder size={size} style={style} className={className} />;
  }

  return (
    <StyledImg
      src={src}
      alt={`${currency?.symbol ?? "token"} logo`}
      size={size}
      style={style}
      className={className}
      onError={() => {
        BAD_SRCS[src] = true;
        refresh((i) => i + 1);
      }}
    />
  );
}

import React, { useMemo } from "react";
import styled from "styled-components";
import Box from "../ui/Box";
import { Currency } from "../../../packages/swap-sdk-core/currency";
import { chainName, DEFAULT_CHAIN_ID } from "@/config/chains";

const Container = styled(Box)`
  width: 100%;
  height: 570px;
  @media (max-width: 1280px) {
    height: 320px;
    padding: 0px 16px 0px 16px;
    overflow: hidden;
  }
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;

  @media (max-width: 1280px) {
    border-radius: 20px;
  }
`;

const TokenChart = ({ baseCurrency }: { baseCurrency: Currency }) => {
  const chartSrc = useMemo(() => {
    return `https://birdeye.so/tv-widget/${baseCurrency?.wrapped?.address}?chain=${chainName[DEFAULT_CHAIN_ID]}&viewMode=pair&chartInterval=15&chartType=Candle&chartLeftToolbar=show&theme=dark`;
  }, [baseCurrency]);

  return (
    <Container>
      <Iframe suppressHydrationWarning title="burger chart" src={chartSrc} />
    </Container>
  );
};

export default TokenChart;

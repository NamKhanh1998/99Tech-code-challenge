import styled from "styled-components";
import Flex from "../ui/Flex";
import Text from "../ui/Text";
import CurrencyLogo from "../currency-logo";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TokenChart from "./TokenChart";
import SwapCard from "./SwapCard";
import { useSwapActionHandler, useSwapState } from "./state";
import { useManageChart } from "./state/chart";

const Container = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Grid = styled.div<{ $showChart?: boolean }>`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: ${({ $showChart }) => ($showChart ? "2.4fr 1fr" : "1fr")};
  grid-auto-flow: row;
  grid-auto-rows: auto;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
`;

const LeftContainer = styled(Flex)`
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  height: calc(100vh - 56px - 65px);
  @media (max-width: 1280px) {
    height: auto;
  }
`;

const RightContainer = styled(Flex)`
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  padding: 16px;
  align-items: start;
`;

const HeaderLeft = styled(Flex)`
  align-items: center;
  padding: 16px;
  gap: 4px;
`;

const WrapperFlipIcon = styled(Flex)`
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.icon};
  cursor: pointer;
`;

const Swap = () => {
  const {
    swapState: { inputCurrency, outputCurrency },
  } = useSwapState();

  const { onSwitchCurrencies } = useSwapActionHandler();

  const {
    chart: { showChart },
  } = useManageChart();

  return (
    <Container>
      <Grid
        $showChart={showChart}
        style={{
          marginTop: showChart ? "0px" : "56px",
        }}
      >
        {showChart && (
          <LeftContainer>
            <HeaderLeft>
              <Flex>
                {inputCurrency && <CurrencyLogo currency={inputCurrency} isUseGradientDot />}
                {outputCurrency && (
                  <CurrencyLogo currency={outputCurrency} isUseGradientDot style={{ zIndex: 1, marginLeft: `-8px` }} />
                )}
              </Flex>
              <Flex>
                {inputCurrency && <Text fontWeight={600}>{inputCurrency?.symbol}/</Text>}
                {outputCurrency && <Text fontWeight={600}>{outputCurrency?.symbol}</Text>}
              </Flex>
              <WrapperFlipIcon onClick={onSwitchCurrencies}>
                <SwapHorizIcon />
              </WrapperFlipIcon>
            </HeaderLeft>
            <TokenChart baseCurrency={inputCurrency} />
          </LeftContainer>
        )}

        <RightContainer>
          <SwapCard />
        </RightContainer>
      </Grid>
    </Container>
  );
};

export default Swap;

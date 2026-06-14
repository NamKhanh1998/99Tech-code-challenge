import { DEFAULT_CHAIN_ID } from "@/config/chains";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import { useMemo } from "react";
import styled from "styled-components";
import CurrencyLogo from "../currency-logo";
import Flex from "../ui/Flex";
import Text from "../ui/Text";
import ExecuteButton from "./ExecuteButton";
import InputPanel from "./InputPanel";
import SwitchBtn from "./SwitchButton";
import { useAggregatorQuotes } from "./aggregator/hooks/useAggregatorQuotes";
import ConfirmTxModal from "./confirm-tx-modal";
import { useCurrencyPrice } from "./hooks/useCurrencyPrice";
import { useDefaultsFromURLSearch } from "./hooks/useDefaultsFromURLSearch";
import { useFetchUserBalances } from "./hooks/useFetchUserBalances";
import Settings from "./settings";
import { Field, useSwapState } from "./state";
import { useManageChart } from "./state/chart";
import { getBalanceKey } from "./utils";
import { displayBalanceValue } from "./utils/bigNumber";

const Container = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled(Flex)`
  width: 100%;
  border-radius: 16px;
`;

const Inner = styled(Flex)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  flex-direction: column;
  justify-content: flex-start;
  background-size: cover;
  background-position: center;
`;

const Header = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled(Text)`
  font-size: 16px;
  font-weight: 600;
`;

const Body = styled(Flex)`
  padding: 16px;
  width: 100%;
  gap: 16px;
  flex-direction: column;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
`;
const InputPanelWrap = styled(Flex)`
  width: 100%;
  flex-direction: column;
  gap: 8px;
  height: max-content;
  position: relative;
`;

const WrapperInfoCurrency = styled(Flex)`
  width: 100%;
  gap: 16px;
`;

const InfoCurrency = styled(Flex)`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.orangeSecondary};
  }
`;

const ChartButton = styled(Flex)`
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.icon};
  cursor: pointer;
  transition: all 0.2s;
  padding: 3px;
  border-radius: 6px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecond};
    transform: scale(1.1);
  }
`;

const currencyInfoStyle = { gap: 8 };
const currencyPriceContainerStyle = { gap: "2px" };

const SwapCard = () => {
  useDefaultsFromURLSearch();

  const {
    swapState: { inputCurrency, outputCurrency, inputValue, outputValue },
  } = useSwapState();

  const { balancesMap, isLoading: isBalanceLoading } = useFetchUserBalances();

  const { price: inputCurrencyPrice } = useCurrencyPrice(inputCurrency?.wrapped?.address);
  const { price: outputCurrencyPrice } = useCurrencyPrice(outputCurrency?.wrapped?.address);

  const { inputCurrencyBalance, inputMaxBalance, outputCurrencyBalance, inputValueInUsd, outputValueInUsd } =
    useMemo(() => {
      if (!balancesMap) {
        return {
          inputCurrencyBalance: "0",
          inputMaxBalance: "",
          outputCurrencyBalance: "0",
          inputValueInUsd: "0",
          outputValueInUsd: "0",
        };
      }

      const inputKey = getBalanceKey(inputCurrency, DEFAULT_CHAIN_ID);
      const outputKey = getBalanceKey(outputCurrency, DEFAULT_CHAIN_ID);

      const inputBalance = inputKey ? balancesMap?.[inputKey]?.toSignificant() || "0" : "0";
      const inputExactBalance = inputKey ? (balancesMap?.[inputKey]?.toExact() ?? "") : "";
      const outputBalance = outputKey ? balancesMap?.[outputKey]?.toSignificant() || "0" : "0";

      const inputUsd =
        inputValue && inputCurrencyPrice ? displayBalanceValue(inputValue, inputCurrencyPrice.toString()) : "0";
      const outputUsd =
        outputValue && outputCurrencyPrice ? displayBalanceValue(outputValue, outputCurrencyPrice.toString()) : "0";

      return {
        inputCurrencyBalance: inputBalance,
        inputMaxBalance: inputExactBalance,
        outputCurrencyBalance: outputBalance,
        inputValueInUsd: inputUsd,
        outputValueInUsd: outputUsd,
      };
    }, [balancesMap, inputCurrency, outputCurrency, inputValue, outputValue, inputCurrencyPrice, outputCurrencyPrice]);

  const {
    chart: { showChart },
    setChart,
  } = useManageChart();

  const { quote, isLoading, error } = useAggregatorQuotes();

  return (
    <Container>
      <Card>
        <Inner>
          <Body>
            <Header>
              <HeaderTitle>Swap</HeaderTitle>
              <Flex>
                <ChartButton onClick={() => setChart((p) => ({ ...p, showChart: !showChart }))}>
                  <CandlestickChartIcon
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                  />
                </ChartButton>
                <Settings />
              </Flex>
            </Header>
            <InputPanelWrap>
              <InputPanel
                currency={inputCurrency}
                field={Field.INPUT}
                value={inputValue}
                currencyBalance={inputCurrencyBalance}
                maxBalance={inputMaxBalance}
                valueInUsd={inputValueInUsd}
                isBalanceLoading={isBalanceLoading}
              />
              <SwitchBtn />
              <InputPanel
                currency={outputCurrency}
                field={Field.OUTPUT}
                value={quote.outAmount}
                currencyBalance={outputCurrencyBalance}
                isLoading={isLoading}
                isBalanceLoading={isBalanceLoading}
                valueInUsd={quote.outValue}
              />
            </InputPanelWrap>
          </Body>
          <Flex justifyContent="center" alignItems="center" padding={16}>
            <ExecuteButton quote={quote} isLoading={isLoading} value={inputValue} error={error} />
          </Flex>
        </Inner>
      </Card>

      <WrapperInfoCurrency>
        {inputCurrency && (
          <InfoCurrency>
            <Flex style={currencyInfoStyle}>
              <CurrencyLogo currency={inputCurrency} />
              <Text fontSize="14px" fontWeight={600}>
                {inputCurrency.symbol}
              </Text>
            </Flex>
            <Flex flexDirection="column" style={currencyPriceContainerStyle}>
              <Text fontSize="14px" fontWeight={600} textAlign="end">
                ${inputCurrencyPrice?.toFixed(4) || "0.00"}
              </Text>
            </Flex>
          </InfoCurrency>
        )}

        {outputCurrency && (
          <InfoCurrency>
            <Flex style={currencyInfoStyle}>
              <CurrencyLogo currency={outputCurrency} />
              <Text fontSize="14px" fontWeight={600}>
                {outputCurrency.symbol}
              </Text>
            </Flex>
            <Flex flexDirection="column" style={currencyPriceContainerStyle}>
              <Text fontSize="14px" fontWeight={600} textAlign="end">
                ${outputCurrencyPrice?.toFixed(4) || "0.00"}
              </Text>
            </Flex>
          </InfoCurrency>
        )}
      </WrapperInfoCurrency>

      <ConfirmTxModal quote={quote} />
    </Container>
  );
};

export default SwapCard;

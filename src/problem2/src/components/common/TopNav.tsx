import { devices } from "@/config";
import { useFetchTopCoins } from "@/hooks/useFetchTopCoins";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Box from "../ui/Box";
import Flex from "../ui/Flex";
import ConnectWalletButton from "../wallet-connect/ConnectWalletButton";
import ConnectWalletIcon from "../wallet-connect/ConnectWalletIcon";
import Price from "./Price";

const StyledTopNav = styled(Flex)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 2;
`;

const Inner = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LeftSide = styled(Flex)`
  height: 100%;
  align-items: center;
  gap: 16px;
`;

const RightSide = styled(Flex)`
  height: 100%;
  align-items: center;
  display: none;
  @media ${devices.laptop} {
    display: flex;
  }
`;

const RightSideMobile = styled(Flex)`
  height: 100%;
  align-items: center;
  gap: 6px;
  display: flex;
  @media ${devices.laptop} {
    display: none;
  }
`;

const MobileBox = styled(Box)`
  display: flex;
  align-items: center;
  @media ${devices.laptop} {
    display: none;
  }
`;

const slideAnimation = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const CoinDisplayContainer = styled(Flex)`
  ${slideAnimation}
  animation: slideDown 0.4s ease-out;
  align-items: center;
`;

const RoundBtn = styled(Flex)`
  height: 32px;
  width: 32px;
  min-width: 32px;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.buttonHover};
  }
`;

const TopNav = () => {
  const [currentCoin, setCurrentCoin] = useState<"bitcoin" | "ethereum">("bitcoin");
  const { topCoins } = useFetchTopCoins();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCoin((prev) => (prev === "bitcoin" ? "ethereum" : "bitcoin"));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentCoinData = currentCoin === "bitcoin" ? topCoins?.bitcoin : topCoins?.ethereum;

  return (
    <StyledTopNav>
      <Inner>
        <LeftSide>
          <Flex>
            <CoinDisplayContainer key={currentCoin}>
              <Image
                alt="token"
                height={20}
                width={20}
                src={currentCoin === "bitcoin" ? "/tokens/popular/bitcoin.png" : "/tokens/popular/eth.png"}
              />
              <Price
                price={currentCoinData?.usd ?? 0}
                change={currentCoinData?.usd_24h_change?.toFixed(2) ?? 0}
                ml="6px"
              />
            </CoinDisplayContainer>
          </Flex>
        </LeftSide>

        <RightSide>
          <RoundBtn style={{ marginRight: 8 }} title="Running on Base">
            <Image alt="Base chain" src="/base.png" width={20} height={20} />
          </RoundBtn>
          <ConnectWalletButton />
        </RightSide>

        <RightSideMobile>
          <MobileBox>
            <RoundBtn title="Running on Base" style={{ marginRight: 4 }}>
              <Image alt="Base chain" src="/base.png" width={20} height={20} />
            </RoundBtn>
            <RoundBtn>
              <ConnectWalletIcon />
            </RoundBtn>
          </MobileBox>
        </RightSideMobile>
      </Inner>
    </StyledTopNav>
  );
};

export default TopNav;

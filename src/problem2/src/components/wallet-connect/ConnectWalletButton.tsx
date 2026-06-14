import React from "react";
import Flex from "../ui/Flex";
import Text from "../ui/Text";
import { ConnectKitButton } from "connectkit";
import styled from "styled-components";
import { WalletIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { makeShortAddress } from "@/utils/formatAddress";
import { theme } from "@/config";

const ConnectButton = styled(Flex)`
  width: 100%;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.xxl};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  height: 38px;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 14px;

  &:hover {
    transform: scale(1.005);
    opacity: 0.9;
  }
`;

const ButtonText = styled(Text)`
  color: ${({ theme }) => theme.colors.black};
  font-size: 14px;
  font-weight: 500;
`;

const ConnectedBtn = styled(Flex)`
  width: 100%;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.xxl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.black};
  height: 38px;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 10px;

  &:hover {
    transform: scale(1.005);
    opacity: 0.9;
  }
`;

const BigDot = styled(Flex)`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${theme.colors.orangeFade};
  justify-content: center;
  align-items: center;
`;

const SmDot = styled(Flex)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${theme.colors.orange};
`;

const ConnectWalletButton = () => {
  const { address: account } = useAccount();
  return (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <>
            {!account ? (
              <ConnectButton onClick={show}>
                <Flex style={{ gap: "4px" }} alignItems="center">
                  <ButtonText>Connect Wallet</ButtonText>
                  <WalletIcon size={18} />
                </Flex>
              </ConnectButton>
            ) : (
              <ConnectedBtn onClick={show}>
                <Flex style={{ gap: "4px" }} alignItems="center">
                  <BigDot>
                    <SmDot />
                  </BigDot>
                  <Text fontSize="14px" fontWeight={600} ml="4px">
                    {makeShortAddress(account as `0x${string}`, 4)}
                  </Text>
                </Flex>
              </ConnectedBtn>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectWalletButton;

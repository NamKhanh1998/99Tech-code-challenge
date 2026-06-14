import React from "react";
import Flex from "../ui/Flex";
import { ConnectKitButton } from "connectkit";
import styled from "styled-components";
import { WalletIcon } from "lucide-react";

const ConnectButton = styled(Flex)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.icon};
`;

const ConnectWalletIcon = () => {
  return (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <ConnectButton onClick={show}>
            <WalletIcon size={18} />
          </ConnectButton>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectWalletIcon;

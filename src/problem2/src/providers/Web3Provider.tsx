import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { APP_SUPPORTED_CHAINS } from "../config/chains";
import WalletAvatar from "../components/wallet-connect/WalletAvatar";

interface Web3ProviderProps {
  children: ReactNode;
}

const transports = APP_SUPPORTED_CHAINS.reduce((acc, chain) => ({ ...acc, [chain.id]: http() }), {});

const config = createConfig(
  getDefaultConfig({
    chains: APP_SUPPORTED_CHAINS,
    transports,
    walletConnectProjectId: "",
    appName: "Code-challenge",
    ssr: true,
    syncConnectedChain: true,
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            customAvatar: WalletAvatar,
            hideNoWalletCTA: true,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

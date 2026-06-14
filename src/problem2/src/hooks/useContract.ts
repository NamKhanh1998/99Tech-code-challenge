import { ChainId } from "@/config/chains";
import { viemClients } from "@/utils/viemClients";
import { useMemo } from "react";
import {
  Abi,
  Address,
  erc20Abi,
  GetContractReturnType,
  PublicClient,
  getContract as viemGetContract,
  WalletClient,
} from "viem";
import { useWalletClient } from "wagmi";
import { useActiveChainId } from "./useActiveChainId";

type UseContractOptions = {
  chainId?: ChainId;
};

const getContract = <TAbi extends Abi | readonly unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BASE,
  publicClient,
  signer,
}: {
  abi: TAbi | readonly unknown[];
  address: Address;
  chainId?: ChainId;
  signer?: TWalletClient;
  publicClient?: PublicClient;
}) => {
  const c = viemGetContract({
    abi,
    address,
    client: {
      public: publicClient ?? viemClients[chainId],
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>;

  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  };
};

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId();
  const chainId = options?.chainId || currentChainId;
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null;
    let address: Address | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      });
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [addressOrAddressMap, abi, chainId, walletClient]);
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Abi);
}

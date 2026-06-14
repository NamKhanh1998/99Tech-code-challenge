import { ChainId } from "@/config/chains";
import { Abi, Address, GetContractReturnType, PublicClient, WalletClient, getContract as viemGetContract } from "viem";
import { createViemPublicClients } from "./viemClients";

const viemClients = createViemPublicClients();

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

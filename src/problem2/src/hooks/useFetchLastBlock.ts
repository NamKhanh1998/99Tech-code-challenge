import { useBlockNumber } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/config/chains";

export const useFetchLastBlock = () => {
  const { data: blockNumber, isLoading } = useBlockNumber({
    chainId: DEFAULT_CHAIN_ID,
    watch: true,
  });

  return {
    blockNumber: blockNumber ? Number(blockNumber).toLocaleString() : "0",
    isLoading,
  };
};

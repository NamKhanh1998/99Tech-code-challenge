import { useCallback } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { TransformedQuote } from "../types";
import { kyberService } from "../services/kyber";
import { useSwapActionState } from "../../state/swapActionState";
import { useActiveChainId } from "@/hooks/useActiveChainId";
import { Address } from "viem";
import { useQueryClient } from "@tanstack/react-query";

export const useExecuteSwap = (quote: TransformedQuote | undefined | null) => {
  const { address: account } = useAccount();
  const { chainId } = useActiveChainId();
  const { setSwapActionstate } = useSwapActionState();
  const config = useConfig();
  const queryClient = useQueryClient();

  const { sendTransactionAsync } = useSendTransaction();

  const executeSwap = useCallback(async () => {
    if (!account || !quote || !quote.routeSummary) {
      setSwapActionstate((p) => ({
        ...p,
        swapErrorMessage: "Missing required data for swap",
        attemptingTxn: false,
      }));
      return;
    }

    try {
      setSwapActionstate((p) => ({
        ...p,
        attemptingTxn: true,
        swapErrorMessage: undefined,
      }));

      // Build the swap transaction
      const builtQuote = await kyberService.buildQuote(account as Address, quote, chainId);

      if (!builtQuote || !builtQuote.data) {
        throw new Error("Failed to build swap transaction");
      }

      // Send the transaction
      const txHash = await sendTransactionAsync({
        to: builtQuote.routerAddress as Address,
        data: builtQuote.data as `0x${string}`,
        value: builtQuote.transactionValue ? BigInt(builtQuote.transactionValue) : BigInt(0),
        gas: builtQuote.gas ? BigInt(builtQuote.gas) : undefined,
      });

      // Wait for receipt
      await waitForTransactionReceipt(config, {
        hash: txHash,
        chainId,
      });

      // Transaction successful
      setSwapActionstate((p) => ({
        ...p,
        txHash,
        attemptingTxn: false,
      }));

      // Immediately mark balance cache as stale so subscribers show outdated state
      await queryClient.invalidateQueries({ queryKey: ["user-balances-global", account] });

      // Wait for the RPC to index the new state, then force a single awaited refetch
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      await queryClient.refetchQueries({ queryKey: ["user-balances-global", account] });
    } catch (error: any) {
      console.error("Swap execution failed:", error);
      setSwapActionstate((p) => ({
        ...p,
        swapErrorMessage: error?.message || "Failed to execute swap",
        attemptingTxn: false,
      }));
    }
  }, [account, quote, chainId, setSwapActionstate, sendTransactionAsync, config, queryClient]);

  return {
    executeSwap,
  };
};

import { useCallback, useMemo, useState } from "react";
import { Address, maxUint256 } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveChainId } from "./useActiveChainId";
import useTokenAllowance from "./useTokenAllowance";
import { useTokenContract } from "./useContract";
import { CurrencyAmount } from "../../packages/swap-sdk-core/fractions/currencyAmount";
import { toastError } from "@/utils/toast";
import { FALL_BACK_ESTIMATED_GAS, calculateGasMargin, getViemErrorMessage, isUserRejected } from "../utils/transaction";
import { Currency } from "../../packages/swap-sdk-core/currency";

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

/**
 * Simplified hook to manage token approval
 * Handles checking approval state and executing approve/revoke transactions
 */
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
  addToTransaction = true,
) {
  const { address: account } = useAccount();
  const { chainId } = useActiveChainId();
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();
  const tokenContract = useTokenContract(
    amountToApprove?.currency?.isToken ? amountToApprove.currency.address : undefined,
  );

  const token = useMemo(
    () => (amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined),
    [amountToApprove?.currency],
  );

  const { allowance: currentAllowance, isLoading: isAllowanceLoading } = useTokenAllowance(token, account ?? undefined, spender);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approvalState: ApprovalState = useMemo(() => {
    if (isPending) return ApprovalState.PENDING;
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED;
    if (!currentAllowance) return ApprovalState.UNKNOWN;
    return currentAllowance.lessThan(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, isPending, spender]);

  const approve = useCallback(
    async (overrideAmount?: bigint) => {
      try {
        setError(null);
        setIsPending(true);

        if (!token || !tokenContract || !spender) {
          throw new Error("Missing required parameters for approval");
        }

        // Estimate and execute approval
        const estimatedGas = await tokenContract.estimateGas
          .approve([spender as Address, maxUint256], {
            account: (account || tokenContract.account) as Address,
          })
          .catch(() => FALL_BACK_ESTIMATED_GAS);

        const txHash = await tokenContract.write.approve([spender as Address, overrideAmount ?? maxUint256], {
          account: (account || tokenContract.account) as Address,
          chain: tokenContract.chain,
          gas: calculateGasMargin(estimatedGas),
        });

        // Wait for confirmation
        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        // Refetch allowance with retries using exact query key
        for (let i = 0; i < 3; i++) {
          await queryClient.refetchQueries({
            queryKey: [chainId, token?.address, account, spender],
          });
          if (i < 2) await new Promise((resolve) => setTimeout(resolve, 500));
        }

        return { hash: txHash };
      } catch (err: any) {
        console.error("Approval error:", err);
        const errorMsg = getViemErrorMessage(err);

        if (!isUserRejected(err)) {
          setError(errorMsg);
          toastError("Approval Failed", errorMsg);
        }

        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [token, tokenContract, spender, account, publicClient, queryClient, chainId, amountToApprove],
  );

  return {
    approvalState,
    approve,
    approveCallback: () => approve(),
    revokeCallback: () => approve(0n),
    currentAllowance,
    isPending,
    isAllowanceLoading,
    error,
  };
}

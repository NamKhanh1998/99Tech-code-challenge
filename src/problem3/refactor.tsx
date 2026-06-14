import React, { useMemo } from 'react'

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string // was missing from original
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string
  priority: number
}

interface Props extends BoxProps {}

// Moved outside component: pure lookup with no dependency on props or state,
// no reason to recreate on every render.
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
}

const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain] ?? -99

const WalletPage: React.FC<Props> = ({ ...rest }: Props) => {
  const balances = useWalletBalances()
  const prices = usePrices()

  const sortedBalances = useMemo(() => {
    return (
      balances
        .filter(
          (balance: WalletBalance) =>
            // Fixed: use balancePriority (not lhsPriority); filter keeps positive amounts only
            getPriority(balance.blockchain) > -99 && balance.amount > 0,
        )
        // Pre-compute priority and formatted string once per item O(n),
        // instead of calling getPriority repeatedly inside sort O(n log n).
        .map(
          (balance: WalletBalance): FormattedWalletBalance => ({
            ...balance,
            priority: getPriority(balance.blockchain),
            formatted: balance.amount.toFixed(),
          }),
        )
        // Fixed: return 0 for equal priorities; simplified to subtraction.
        .sort(
          (lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) =>
            rhs.priority - lhs.priority,
        )
    )
  }, [balances]) // Fixed: removed prices — it is not used in this computation

  // Fixed: memoized to avoid re-running on every render;
  // uses sortedBalances (which already has `formatted` and `priority` attached).
  const rows = useMemo(
    () =>
      sortedBalances.map((balance: FormattedWalletBalance) => (
        <WalletRow
          className={classes.row}
          key={balance.currency} // Fixed: stable key instead of array index
          amount={balance.amount}
          usdValue={prices[balance.currency] * balance.amount}
          formattedAmount={balance.formatted} // Fixed: now actually defined on the object
        />
      )),
    [sortedBalances, prices],
  )

  return <div {...rest}>{rows}</div>
}

export default WalletPage

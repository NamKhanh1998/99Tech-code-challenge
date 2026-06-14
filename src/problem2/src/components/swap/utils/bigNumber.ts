import BigNumber from 'bignumber.js'
import { isNumber, isUndefined } from 'lodash'

export const BIG_TEN = new BigNumber(10)

export const getBalanceAmount = (amount: string, decimals: number) => {
  if (!isNumber(decimals)) return new BigNumber(0)
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals))
}

const getBalanceValue = (amount: string, price: string) => {
  if (!amount || !price || !isNumber(Number(amount)) || !isNumber(Number(price)))
    return new BigNumber(0)
  return new BigNumber(amount).times(price)
}

export const displayBalanceValue = (amount: string, price: string) => {
  if (isUndefined(price) || !price) {
    return '-'
  }

  const value = getBalanceValue(amount, price)
  const valueNumber = Number(value)

  if (valueNumber < 0.0001) {
    return '<0.0001'
  }

  return `~${valueNumber?.toLocaleString(undefined, {
    maximumFractionDigits: 3,
  })}`
}

import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import { useSwapState } from '../state'
import { useCombineTokenList } from './useCombineTokenList'
import { isString } from 'lodash'

export const useDefaultsFromURLSearch = () => {
  const { setSwapState } = useSwapState()
  const { query, isReady } = useRouter()
  const tokenList = useCombineTokenList()
  const previousParamsRef = useRef<{ input?: string; output?: string }>({})

  // Create a map of address/symbol -> token for quick lookup
  const tokenMap = useMemo(() => {
    const map = new Map<string, any>()
    tokenList?.forEach((token) => {
      // Map by symbol for convenience
      map.set(token.symbol?.toLowerCase() || '', token)
      // Also map by address if it's a Token (not NativeCurrency)
      if ('address' in token && token.address) {
        map.set(token.address?.toLowerCase(), token)
      }
    })
    return map
  }, [tokenList])

  useEffect(() => {
    // Only run when router is ready
    if (!isReady) {
      return
    }

    const inputCurrencyId = query?.inputCurrencyId as string | undefined
    const outputCurrencyId = query?.outputCurrencyId as string | undefined

    // Only process if the URL params have actually changed
    if (
      inputCurrencyId === previousParamsRef.current.input &&
      outputCurrencyId === previousParamsRef.current.output
    ) {
      return
    }

    // Update the tracked params
    previousParamsRef.current = { input: inputCurrencyId, output: outputCurrencyId }

    // Sync state from URL without triggering URL updates
    const updates: any = {}

    if (inputCurrencyId && isString(inputCurrencyId)) {
      const currencyId = inputCurrencyId.toLowerCase()
      const inputCurrency = tokenMap.get(currencyId)
      if (inputCurrency) {
        updates.inputCurrency = inputCurrency
      }
    }

    if (outputCurrencyId && isString(outputCurrencyId)) {
      const currencyId = outputCurrencyId.toLowerCase()
      const outputCurrency = tokenMap.get(currencyId)
      if (outputCurrency) {
        updates.outputCurrency = outputCurrency
      }
    }

    // Apply all updates at once without triggering multiple URL pushes
    if (Object.keys(updates).length > 0) {
      setSwapState((prev) => ({ ...prev, ...updates }))
    }
  }, [isReady, query?.inputCurrencyId, query?.outputCurrencyId, setSwapState, tokenMap])
}

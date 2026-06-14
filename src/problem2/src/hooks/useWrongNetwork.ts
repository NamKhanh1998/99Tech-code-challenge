import { useAccount, useSwitchChain } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'
import { DEFAULT_CHAIN_ID } from '@/config/chains'

export const useWrongNetwork = () => {
  const { isConnected } = useAccount()
  const { isChainSupport } = useActiveChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  const isWrongNetwork = isConnected && !isChainSupport

  const switchToSupportedNetwork = () => {
    switchChain({ chainId: DEFAULT_CHAIN_ID })
  }

  return {
    isWrongNetwork,
    switchToSupportedNetwork,
    isSwitching,
  }
}

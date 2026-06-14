import { atom, useAtom } from 'jotai'

export interface ISwapActionState {
  attemptingTxn: boolean
  swapErrorMessage: string | undefined
  txHash: string | undefined
  showConfirmModal: boolean
}

const initState: ISwapActionState = {
  attemptingTxn: false,
  swapErrorMessage: undefined,
  txHash: undefined,
  showConfirmModal: false,
}

export const swapActionState = atom<ISwapActionState>(initState)

export const useSwapActionState = () => {
  const [data, setData] = useAtom(swapActionState)

  return {
    swapActionState: data,
    setSwapActionstate: setData,
  }
}

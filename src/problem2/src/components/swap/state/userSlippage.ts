import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export enum SlippageTolerance {
  AUTO = "Auto",
  ONE = 1,
  THREE = 3,
  FIVE = 5,
}

export interface IUserSlippage {
  slippage: SlippageTolerance;
  customSlippage: string;
}

const initState: IUserSlippage = {
  slippage: SlippageTolerance.AUTO,
  customSlippage: "",
};

export const slippageState = atomWithStorage<IUserSlippage>("slippageState", initState);

export const useUserSlippage = () => {
  const [data, setData] = useAtom(slippageState);

  return {
    userSlippage: data,
    setUserSlippage: setData,
    activeSlippage: data?.customSlippage || data.slippage,
  };
};

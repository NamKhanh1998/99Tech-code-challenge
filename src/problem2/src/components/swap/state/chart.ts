import { atom, useAtom } from "jotai";

export interface ChartState {
  showChart: boolean;
}

const initState: ChartState = {
  showChart: false,
};

const chartAtom = atom<ChartState>(initState);

export const useManageChart = () => {
  const [data, setData] = useAtom(chartAtom);

  return {
    chart: data,
    setChart: setData,
  };
};

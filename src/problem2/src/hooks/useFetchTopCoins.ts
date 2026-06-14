import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TopCoinData {
  bitcoin: {
    usd: number;
    usd_24h_change: number;
  };
  ethereum: {
    usd: number;
    usd_24h_change: number;
  };
}

const fetchTopCoins = async (): Promise<TopCoinData> => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: "bitcoin,ethereum",
        vs_currencies: "usd",
        include_24hr_change: true,
      },
    }
  );
  return response.data;
};

export const useFetchTopCoins = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["topCoins"],
    queryFn: fetchTopCoins,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });

  return {
    topCoins: data,
    isLoading,
    refetch,
  };
};

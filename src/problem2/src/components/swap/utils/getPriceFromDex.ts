import { chainName } from "@/config/chains";
import axios from "axios";
import PQueue from "p-queue";

const CHUNK_SIZE = 30;

const dexscreenerQueue = new PQueue({
  concurrency: 1,
  interval: 70_000,
  intervalCap: 200,
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getUniqueArray = (arr: string[]) => {
  const uniqueMap = new Map();
  arr.forEach((item) => uniqueMap.set(item, item));
  return Array.from(uniqueMap.values());
};

const chunkData = async (items: string[], chunkSize: number, callback: (chunk: string[]) => Promise<any[]>) => {
  const results: any[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const res = await callback(chunk);
    if (res) {
      results.push(...res);
    }
    await delay(2000);
  }

  return results;
};

export const fetchDataDexscreener = async (chainId: number, arrAddress: string[]) => {
  const addressStr = arrAddress.join(",");
  const url = `https://api.dexscreener.com/tokens/v1/${chainName[chainId]}/${addressStr}`;

  try {
    const res = await axios.get(url);

    return res?.data?.map((token: any) => {
      const priceStr = token?.priceUsd;
      const priceNum = priceStr != null && !isNaN(Number(priceStr)) ? Number(priceStr) : null;

      return {
        address: token?.baseToken?.address?.toLowerCase(),
        priceUsd: priceNum, // convert to number
        price24hChange: token?.priceChange?.h24 ?? null,
      };
    });
  } catch (error) {
    return null;
  }
};

export const getPriceFromDex = async (arrAddress: string[], chainId: number) => {
  const uniqueArray = getUniqueArray(arrAddress);

  const results = await chunkData(
    uniqueArray,
    CHUNK_SIZE,
    (chunk) => dexscreenerQueue.add(() => fetchDataDexscreener(chainId, chunk)) as Promise<any[]>,
  );

  return results;
};

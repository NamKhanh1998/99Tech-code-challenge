import { ChainId, APP_SUPPORTED_CHAINS as CHAINS } from "@/config/chains";
import { PUBLIC_NODES } from "@/config/nodes";
import { first } from "lodash";
import { createPublicClient, fallback, http, PublicClient } from "viem";

const CLIENT_CONFIG = {
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
};

function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export type CreatePublicClientParams = {
  transportSignal?: AbortSignal;
};

export function createViemPublicClients({ transportSignal }: CreatePublicClientParams = {}) {
  return CHAINS.reduce((prev, cur) => {
    const urls = PUBLIC_NODES[cur.id as ChainId] ?? [];
    const shuffledUrls = shuffle([...urls]);
    return {
      ...prev,
      [cur.id]: createPublicClient({
        chain: cur,
        transport: fallback(
          shuffledUrls.map((url) =>
            http(url, {
              timeout: 10_000,
              fetchOptions: {
                signal: transportSignal,
              },
            }),
          ),
          {
            rank: false,
          },
        ),
        batch: {
          multicall: {
            batchSize: 1024 * 200,
            wait: 16,
          },
        },
        pollingInterval: 6_000,
      }),
    };
  }, {} as Record<ChainId, PublicClient>);
}

export const viemClients = createViemPublicClients();

export const getViemClients = createViemPublicClientGetter({ viemClients });

type CreateViemPublicClientGetterParams = {
  viemClients?: Record<ChainId, PublicClient>;
} & CreatePublicClientParams;

export function createViemPublicClientGetter({
  viemClients: viemClientsOverride,
  ...restParams
}: CreateViemPublicClientGetterParams = {}) {
  const clients = viemClientsOverride || createViemPublicClients(restParams);
  return function getClients({ chainId }: { chainId?: ChainId }): PublicClient {
    return clients[chainId as ChainId];
  };
}

export const publicClient = ({ chainId }: { chainId?: ChainId }) => {
  if (chainId && viemClients[chainId]) {
    return viemClients[chainId];
  }
  const httpString = chainId && first(PUBLIC_NODES[chainId]) ? first(PUBLIC_NODES[chainId]) : undefined;

  const chain = CHAINS.find((c) => c.id === chainId);
  return createPublicClient({ chain, transport: http(httpString), ...CLIENT_CONFIG });
};

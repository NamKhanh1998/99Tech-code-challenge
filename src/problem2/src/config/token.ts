import { ERC20Token } from "../../packages/swap-sdk-core/erc20Token";
import { ChainId } from "./chains";

export const GELATO_NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const WETH9: Record<number, ERC20Token> = {
  [ChainId.BASE]: new ERC20Token(
    ChainId.BASE,
    "0x4200000000000000000000000000000000000006",
    18,
    "WETH",
    "Wrapped Ether",
    "https://weth.io",
  ),
};

export const WNATIVE: Record<number, ERC20Token> = {
  [ChainId.BASE]: WETH9[ChainId.BASE],
} satisfies Record<ChainId, ERC20Token>;

const ETHER = { name: "Ether", symbol: "ETH", decimals: 18 } as const;

export const NATIVE = {
  [ChainId.BASE]: ETHER,
} satisfies Record<
  ChainId,
  {
    name: string;
    symbol: string;
    decimals: number;
  }
>;

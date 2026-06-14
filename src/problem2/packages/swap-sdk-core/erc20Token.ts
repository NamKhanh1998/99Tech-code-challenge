import { validateAndParseAddress } from "../../src/utils/address";
import { Token } from "./token";
import { Address } from "viem";

export class ERC20Token extends Token {
  public constructor(
    chainId: number,
    address: Address,
    decimals: number,
    symbol: string,
    name?: string,
    logoURI?: string,
  ) {
    super(chainId, validateAndParseAddress(address), decimals, symbol, name, logoURI);
  }
}

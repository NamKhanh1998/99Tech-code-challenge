import memoize from "lodash/memoize";
import { Address, getAddress } from "viem";
import invariant from "tiny-invariant";
import warning from "tiny-warning";
import { ChainId } from "@/config/chains";

export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value;
    if (typeof value === "string" && !value.startsWith("0x")) {
      value_ = `0x${value}`;
    }
    return getAddress(value_);
  } catch {
    return undefined;
  }
});

export const getAddressFromMap = (address: any, chainId?: number): `0x${string}` => {
  return chainId && address[chainId]
    ? address[chainId]
    : address[ChainId.BASE] || "0x0000000000000000000000000000000000000000";
};

export function validateAndParseAddress(address: string): Address {
  try {
    const checksummedAddress = getAddress(address);
    warning(address === checksummedAddress, `${address} is not checksummed.`);
    return checksummedAddress;
  } catch {
    invariant(false, `${address} is not a valid address.`);
  }
}

export const FALL_BACK_ESTIMATED_GAS = BigInt(150000);

export const calculateGasMargin = (value: bigint): bigint => {
  return (value * BigInt(120)) / BigInt(100);
};

export const getViemErrorMessage = (error: any): string => {
  return error?.message || "Transaction failed";
};

export const isUserRejected = (error: any): boolean => {
  return error?.message?.includes("rejected") || error?.message?.includes("denied");
};

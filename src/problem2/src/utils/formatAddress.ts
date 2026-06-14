export const makeShortAddress = (address: string, shortNumber: number) => {
  if (!address) return "N/A";

  return `${address.substring(0, shortNumber)}...${address.slice(-shortNumber)}`;
};

import { atom } from "jotai";

export const tokenPriceAtom = atom<Record<string, number | null>>({});

import { DefaultSeoProps } from "next-seo";

export const SEO: DefaultSeoProps = {
  title: "Swap Form",
  titleTemplate: "%s | Swap Form Code Challenge",
  defaultTitle: "Swap Form Code Challenge",
  description: "A token swap form built as a code challenge. Supports ERC-20 token selection, balance display, and swap execution on Base network.",
  openGraph: {
    type: "website",
    title: "Swap Form Code Challenge",
    description: "A token swap form built as a code challenge. Supports ERC-20 token selection, balance display, and swap execution on Base network.",
    siteName: "Swap Form Code Challenge",
    locale: "en_US",
  },
};

export const PAGE_SEO = {
  swap: {
    title: "Swap",
    titleTemplate: "%s | Swap Form Code Challenge",
    description: "Swap ERC-20 tokens on Base network. Select input and output tokens, enter an amount, and execute the swap.",
  },
};

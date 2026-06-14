import { MainLayout } from "@/components/layout";
import Swap from "@/components/swap";
import { NextSeo } from "next-seo";
import { PAGE_SEO } from "../../next-seo.config";

const SwapPage = () => {
  return (
    <>
      <NextSeo {...PAGE_SEO.swap} />
      <Swap />
    </>
  );
};

SwapPage.Layout = MainLayout;

export default SwapPage;

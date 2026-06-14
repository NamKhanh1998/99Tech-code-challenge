import { AppPropsWithLayout } from "@/types/layout";
import { MainLayout } from "@/components/layout";
import { DefaultSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { ToastContainer } from "react-toastify";
import { theme } from "@/config";
import { ThemeProvider } from "styled-components";
import { Web3Provider } from "@/providers/Web3Provider";
import { useFetchUserBalances } from "@/components/swap/hooks/useFetchUserBalances";
import "@/styles/globals.css";
import { inter } from "@/styles/fonts";

const GlobalHooks = () => {
  useFetchUserBalances();
  return null;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component?.Layout || MainLayout;

  return (
    <main className={inter.className}>
      <style jsx global>{`
        html {
          background-color: ${theme.colors.background};
        }
        body {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <DefaultSeo {...SEO} />

      <Web3Provider>
        <ThemeProvider theme={theme}>
          <Layout>
            <ToastContainer theme="dark" />
            <GlobalHooks />
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </Web3Provider>
    </main>
  );
}

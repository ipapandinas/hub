import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { WalletConnectClientContextProvider } from "../contexts/WalletConnectClientContext";
import React, { useRef, useEffect } from "react";
import SEO from "../constants/seo";

const Initialize = () => {
  const initialized = useRef<boolean>();

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <DefaultSeo {...SEO} />
        <WalletConnectClientContextProvider>
          <Initialize />
          <Component {...pageProps} />
        </WalletConnectClientContextProvider>
    </React.Fragment>
  );
}

export default MyApp;

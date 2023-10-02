import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Goerli } from "@thirdweb-dev/chains";
import { Toaster } from "react-hot-toast";
import Head from "next/head";


// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
// const activeChain = "ethereum";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={Goerli}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}>
      <Head>
        <title>Token Minting</title>
      </Head>
      <Component {...pageProps} />
      <Toaster></Toaster>
    </ThirdwebProvider>
  );
}

export default MyApp;

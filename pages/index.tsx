import React from "react";
import Head from "next/head";
import Image from "next/image";

import { NextPage } from "next";
import { Game } from "../components/base/game";
import { Button } from "../components/ui/button";
import { useWalletConnectClient } from "../hooks/useWalletConnectClient";

const META_TITLE = "Wolf Hunters | TERNOA X WLF PROJECT";
const META_DESCRIPTION =
  "Delve into the exhilarating world of WOLF HUNTERS MINI-GAME, brought to you by the incredible WLF PROJECT, on the Ternoa Blockchain. Dive headfirst into this gripping adventure and stand a chance to seize a jaw-dropping $10k prize pool in Ternoa Coin ($CAPS) and Werewolf Token ($WLF) through a limited-time airdrop!";

const Home: NextPage = () => {
  const { disconnect, isConnected, isDisconnecting } = useWalletConnectClient();
  return (
    <>
      <Head>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/favicon-16x16.png"
        />
        <link rel="manifest" href="/assets/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000" />
        <meta name="theme-color" content="#000" />
        <meta
          property="og:image"
          content="https://wolf-hunters.vercel.app/assets/logo.png"
        />
        <meta property="og:title" content={META_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:image:alt" content="Wolf Hunters" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="200" />
        <meta property="og:image:height" content="200" />
        <meta property="twitter:title" content={META_TITLE} />
        <meta property="twitter:description" content={META_DESCRIPTION} />
        <meta property="og:url" content="https://wolf-hunters.vercel.app" />
        <meta
          name="twitter:image"
          content="https://wolf-hunters.vercel.app/assets/logo.png"
        />
        <meta property="twitter:image:alt" content="Wolf Hunters" />
        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="200" />
        <meta name="twitter:image:height" content="200" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ternoa_" />
        <meta name="twitter:creator" content="@ternoa_" />
      </Head>
      <div className="container z-10 mt-8 flex max-w-lg flex-col items-center justify-around gap-4 px-4 py-8 lg:mt-20">
        <Image
          className="h-auto w-auto"
          alt="Wolf Hunters Logo"
          src="/assets/logo.png"
          height={80}
          width={80}
        />
        <h1 className="font-slackside text-5xl">Wolf Hunters</h1>
        <h2 className="text-2xl font-light">Ternoa X WLF Project</h2>
        <div className="mt-10 flex flex-col justify-center">
          <Game />
          {isConnected && (
            <Button
              className="mt-8"
              disabled={isDisconnecting}
              onClick={disconnect}
              variant="link"
            >
              Disconnect wallet
            </Button>
          )}
        </div>
        <Image
          className="relative bottom-0 z-0 h-auto w-auto"
          alt="Wolf Hunters Logo"
          src="/assets/wolf.gif"
          priority
          height={350}
          width={620}
        />
      </div>
    </>
  );
};

export default Home;

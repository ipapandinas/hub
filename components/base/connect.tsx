import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getErrorMessage } from "../../lib/utils";

import { AppleIcon } from "../icons/AppleIcon";
import { AndroidIcon } from "../icons/AndroidIcon";
import { useWalletConnectClient } from "../../hooks/useWalletConnectClient";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { TernoaIcon } from "../icons/TernoaIcon";
import { Button } from "../ui/button";
import { upsertUser } from "../../lib/user";

export function Connect() {
  const { connect } = useWalletConnectClient();

  const [error, setError] = useState("");

  const onTernoaConnect = async () => {
    try {
      setError("");
      const address = await connect();
      console.log({address})
      if (address) {
        await upsertUser(address);
      }
    } catch (err) {
      const message = `Error while connecting Ternoa Wallet - Details: ${getErrorMessage(
        err
      )}`;
      setError(message);
      console.error(message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="relative flex p-10 pt-4 text-3xl shadow-none outline-none"
          id="next-image-container"
        >
          <Image
            className="absolute left-0 top-0"
            alt="Button"
            src="/assets/button.png"
            height={70}
            width={207}
            priority
          />
          <span className="z-10 font-black">Connect</span>
        </div>
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 flex flex-col items-center w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-8 border-[#5E5FC8] bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full sm:max-w-[425px]">
        <p className="font-lato">Enter the</p>
        <h3 className="font-slackside text-5xl">Wolf Hunters</h3>
        <p className="font-lato">mini game</p>
        <button
          className="relative mt-10 flex px-7 py-10 pt-4 text-3xl shadow-none outline-none"
          onClick={onTernoaConnect}
          id="next-image-container-long"
        >
          <Image
            className="absolute left-0 top-0"
            alt="Button"
            src="/assets/button-long.png"
            height={70}
            width={344}
            priority
          />
          <div className="z-10 flex flex-nowrap items-center gap-4 whitespace-nowrap">
            <TernoaIcon className="mr-2 h-8 w-auto fill-white" />
            Ternoa Wallet
          </div>
        </button>
        <p className="max-w-xs text-center text-slate-400">
          You will have to come back to the app manually
          <br />
          Ternoa wallet won&apos;t work in energy saving mode
        </p>
        {error !== "" && (
          <p className="max-w-xs text-center text-red-500">{error}</p>
        )}
        <p className="mx-4 my-8 max-w-xs border-t-4 border-dashed border-slate-400 p-8 pb-0 text-center text-2xl text-slate-400 lg:mx-16">
          You don’t have a Ternoa wallet yet ?
        </p>
        <div className="flex items-center space-x-8">
          <Link
            title="ios app"
            href="https://apps.apple.com/us/app/ternoa-wallet/id1562180877#?platform=iphone"
          >
            <Button variant="default">
              <AppleIcon className="mr-2 h-4 w-auto" />
              ios
            </Button>
          </Link>
          <Link
            title="ios app"
            href="https://play.google.com/store/apps/details?id=com.ternoa.wallet.prod"
          >
            <Button variant="default">
              <AndroidIcon className="mr-2 h-4 w-auto" />
              android
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

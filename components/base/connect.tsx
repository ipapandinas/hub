import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import { TernoaIcon } from "~/components/icons/TernoaIcon";
// import { Button } from "~/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { getErrorMessage } from "../../lib/utils";
// import { api } from "~/utils/api";

import { AppleIcon } from "../icons/AppleIcon";
import { AndroidIcon } from "../icons/AndroidIcon";
import { useWalletConnectClient } from "../../hooks/useWalletConnectClient";

export function Connect() {
  const { connect, isConnecting } = useWalletConnectClient();

  // const { mutateAsync: createUser } = api.user.create.useMutation();

  const [error, setError] = useState("");

  const onTernoaConnect = async () => {
    try {
      setError("");
      const address = await connect();
      // if (address) {
      //   await createUser({ userId: address });
      // }
    } catch (err) {
      const message = `Error while connecting Ternoa Wallet - Details: ${getErrorMessage(
        err,
      )}`;
      setError(message);
      console.error(message);
    }
  };

  return (
    // <Dialog>
    //   <DialogTrigger>
    //     <div className="relative flex p-10 pt-4 text-3xl shadow-none outline-none">
    //       <Image
    //         className="absolute left-0 top-0"
    //         alt="Button"
    //         src="/assets/button.png"
    //         height={70}
    //         width={207}
    //         priority
    //       />
    //       <span className="z-10 font-black">Connect</span>
    //     </div>
    //   </DialogTrigger>
    //   <DialogContent className="flex flex-col items-center">
    //     <p className="font-lato">Enter the</p>
    //     <h3 className="font-slackside text-5xl">Wolf Hunters</h3>
    //     <p className="font-lato">mini game</p>
    //     <button
    //       disabled={isConnecting}
    //       className="relative mt-10 flex px-7 py-10 pt-4 text-3xl shadow-none outline-none"
    //       onClick={onTernoaConnect}
    //     >
    //       <Image
    //         className="absolute left-0 top-0"
    //         alt="Button"
    //         src="/assets/button-long.png"
    //         height={70}
    //         width={344}
    //         priority
    //       />
    //       <div className="z-10 flex flex-nowrap items-center gap-4 whitespace-nowrap">
    //         <TernoaIcon className="mr-2 h-8 w-auto fill-white" />
    //         Ternoa Wallet
    //       </div>
    //     </button>
    //     <p className="max-w-xs text-center text-orange-400">
    //       You will have to come back to the app manually
    //       <br />
    //       Ternoa wallet won&apos;t work in energy saving mode
    //     </p>
    //     {error !== "" && (
    //       <p className="max-w-xs text-center text-red-500">{error}</p>
    //     )}
    //     <p className="mx-4 my-8 max-w-xs border-t-4 border-dashed border-slate-400 p-8 pb-0 text-center text-2xl text-slate-400 lg:mx-16">
    //       You don’t have a Ternoa wallet yet ?
    //     </p>
    //     <div className="flex items-center space-x-8">
    //       <Link
    //         title="ios app"
    //         href="https://apps.apple.com/us/app/ternoa-wallet/id1562180877#?platform=iphone"
    //       >
    //         <Button variant="default">
    //           <AppleIcon className="mr-2 h-4 w-auto" />
    //           ios
    //         </Button>
    //       </Link>
    //       <Link
    //         title="ios app"
    //         href="https://play.google.com/store/apps/details?id=com.ternoa.wallet.prod"
    //       >
    //         <Button variant="default">
    //           <AndroidIcon className="mr-2 h-4 w-auto" />
    //           android
    //         </Button>
    //       </Link>
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <button onClick={onTernoaConnect}>Connect</button>
  );
}

/* eslint-disable */

import Image from "next/image";
import { useState } from "react";
// import { Loader2 } from "lucide-react";
import {
  NFTDelegatedEvent,
  WaitUntil,
  delegateNftTx,
  getRawApi,
  initializeApi,
  isApiConnected,
  submitTxBlocking,
} from "ternoa-js";

// import { api } from "~/utils/api";

import { useWalletConnectClient } from "../../hooks/useWalletConnectClient";
import { getErrorMessage } from "../../lib/utils";
import { BLOCKCHAIN_URL, SIGNATURE_TIMEOUT } from "../../lib/constants";
import { timeoutFunction } from "../../lib/fn";
import { retry } from "../../lib/fn";

export function GenericDelegateButton({
  disabled,
  nftId,
  recipient,
  onSuccess,
}: {
  disabled?: boolean;
  nftId?: number;
  recipient?: string;
  onSuccess?: () => Promise<void>;
}) {
  const { account, request } = useWalletConnectClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // const { mutateAsync: updateUser } = api.user.upsert.useMutation();

  const isUndelegate = recipient === undefined;

  const handleDelegate = async (
    account: string,
    nftId: number,
    recipient?: string,
  ) => {
    if (!isApiConnected()) {
      await initializeApi(BLOCKCHAIN_URL);
    }
    const api = getRawApi();
    const nonce = Number(
      ((await api.query?.system?.account?.(account)) as any)?.nonce,
    );
    const tx = await delegateNftTx(nftId, recipient);
    const signedTx = (await timeoutFunction(
      async () => await request(tx),
      SIGNATURE_TIMEOUT,
    )) as `0x${string}`;
    if (!signedTx) throw new Error("Unable to sign txn");
    const { events, blockInfo } = await retry(submitTxBlocking, [signedTx, WaitUntil.BlockInclusion]);
    events.findEventOrThrow(NFTDelegatedEvent);
    const timestamp = blockInfo.blockHash
      ? Number(await api.query?.timestamp?.now?.at(blockInfo.blockHash))
      : new Date();
    return new Date(timestamp);
  };

  const onEnter = async () => {
    try {
      setIsLoading(true);
      setError("");
      if (!account) throw new Error("Account is not connected");
      if (!recipient) throw new Error("No recipient provided");
      if (!nftId) throw new Error("No NFT id provided");
      const timestampEnter = await handleDelegate(account, nftId, recipient);

      // await updateUser({
      //   paramsUnique: { userId: account },
      //   body: {
      //     timestampEnter,
      //   },
      // });
      if (onSuccess) await onSuccess();
    } catch (err) {
      const message = `Error while entering - Details: ${getErrorMessage(err)}`;
      setError(message);
      setIsLoading(false);
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onExit = async () => {
    try {
      setIsLoading(true);
      setError("");
      if (!account) throw new Error("Account is not connected");

      if (nftId) {
        await handleDelegate(account, nftId);
        if (onSuccess) await onSuccess();
      } else {
        // await updateUser({
        //   paramsUnique: { userId: account },
        //   body: {
        //     timestampExit: new Date(),
        //   },
        // });
      }
    } catch (err) {
      const message = `Error while exiting - Details: ${getErrorMessage(err)}`;
      setError(message);
      setIsLoading(false);
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isUndelegate ? (
        <button
          disabled={!!disabled || isLoading}
          className={`relative mx-auto mt-10 flex justify-between gap-4 px-7 py-2 shadow-none outline-none disabled:opacity-30 ${
            isLoading ? "pl-4 pt-4" : "pt-4"
          }`}
          onClick={onExit}
        >
          <Image
            className="absolute left-0 top-0"
            alt="Button"
            src="/assets/home-button.png"
            height={67}
            width={121}
            priority
          />
          <span className="z-10 flex items-center text-xl font-black">
            {/* {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin " />} */}
            Home
          </span>
        </button>
      ) : (
        <button
          disabled={!!disabled || isLoading}
          className={`relative mx-auto mt-10 flex justify-between gap-4 px-7 py-2 shadow-none outline-none disabled:opacity-30 ${
            isLoading ? "pl-5 pt-3" : "pt-2"
          }`}
          onClick={onEnter}
        >
          <Image
            className="absolute left-0 top-0"
            alt="Button"
            src="/assets/button.png"
            height={70}
            width={207}
            priority
          />
          <span className="z-10 flex items-center text-xl font-black">
            {/* {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin " />} */}
            Delegate
          </span>
        </button>
      )}
      {error !== "" && (
        <p className="mt-8 max-w-xs text-center text-red-500">{error}</p>
      )}
    </div>
  );
}

/* eslint-disable */

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  NFTDelegatedEvent,
  WaitUntil,
  delegateNftTx,
  getRawApi,
  initializeApi,
  isApiConnected,
  submitTxBlocking,
} from "ternoa-js";

import { useWalletConnectClient } from "../../hooks/useWalletConnectClient";
import { getErrorMessage } from "../../lib/utils";
import { BLOCKCHAIN_URL, SIGNATURE_TIMEOUT } from "../../lib/constants";
import { timeoutFunction } from "../../lib/fn";
import { retry } from "../../lib/fn";
import { upsertUser } from "../../lib/user";
import { INft } from "../../lib/graphql";
import { IUser } from "./game";

export function GenericDelegateButton({
  disabled,
  nftId,
  recipient,
  setNft,
  setUser
}: {
  disabled?: boolean;
  nftId?: number;
  recipient?: string;
  setNft?: Dispatch<SetStateAction<INft | undefined>>;
  setUser?: Dispatch<SetStateAction<IUser | undefined>>;
}) {
  const { account, request } = useWalletConnectClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isUndelegate = recipient === undefined;

  const handleDelegate = async (
    _account: string,
    nftId: number,
    recipient?: string
  ) => {
    if (!isApiConnected()) {
      await initializeApi(BLOCKCHAIN_URL);
    }
    const api = getRawApi();
    // const nonce = Number(
    //   ((await api.query?.system?.account?.(account)) as any)?.nonce,
    // );
    const tx = await delegateNftTx(nftId, recipient);
    const signedTx = (await timeoutFunction(
      async () => await request(tx),
      SIGNATURE_TIMEOUT
    )) as `0x${string}`;
    if (!signedTx) throw new Error("Unable to sign txn");
    const { events, blockInfo } = await retry(submitTxBlocking, [
      signedTx,
      WaitUntil.BlockInclusion,
    ]);
    const res = events.findEventOrThrow(NFTDelegatedEvent);
    if (res && setNft) {
      setNft((prevState) => {
        if (prevState)
          return { ...prevState, isDelegated: Boolean(res.recipient) };
      });
    }
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
      const res = await upsertUser(account, timestampEnter);
      if (res.ok && setUser) {
        const user = await res.json();
        setUser(user);
      }
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
      } else {
        const res = await upsertUser(account, undefined, new Date());
        if (res.ok && setUser) {
          const user = await res.json();
          setUser(user);
        }
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
          className={`relative mx-auto mt-10 flex justify-between gap-4 px-7 py-2 pt-[17px] text-3xl shadow-none outline-none disabled:opacity-30 ${
            isLoading ? "pl-4 pt-4" : "pt-4"
          }`}
          onClick={onExit}
          id="next-image-container"
        >
          <Image
            className="absolute left-0 top-0"
            alt="Button"
            src="/assets/home-button.png"
            height={67}
            width={121}
            priority
          />
          <span className="z-10 flex items-center font-black">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
            Home
          </span>
        </button>
      ) : (
        <button
          disabled={!!disabled || isLoading}
          className={`w-[207px] justify-center relative mx-auto mt-10 flex gap-4 px-7 py-2 p-10 pt-[17px] text-3xl shadow-none outline-none disabled:opacity-30 ${
            isLoading ? "pl-5 pt-3" : "pt-2"
          }`}
          onClick={onEnter}
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
          <span className="z-10 flex items-center font-black">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
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

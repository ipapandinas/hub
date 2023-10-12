import { Dispatch, SetStateAction, useEffect, useState } from "react";

import type { INft } from "../../lib/graphql";
import { getNfts } from "../../lib/graphql";
import { getErrorMessage } from "../../lib/utils";

import { useWalletConnectClient } from "../../hooks/useWalletConnectClient";

import { Connect } from "./connect";
import { GenericDelegateButton } from "./delegation";
import { Skeleton } from "../ui/skeleton";
import { getUserById } from "../../lib/user";

export interface IUser {
  id: string;
  timestampEnter: Date | null;
  timestampExit: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function Game() {
  const { account, isConnected, isInitializing } = useWalletConnectClient();

  const [isLoading, setIsLoading] = useState(false);
  const [nftId, setNftId] = useState("");
  const [isNftDelegated, setIsNftDelegated] = useState(false);
  const [hasEnter, setHasEnter] = useState(false);
  const [hasExit, setHasExit] = useState(false);

  const currentDate = new Date();
  const limitDate = new Date(currentDate.getFullYear(), 9, 12);
  const hasLimitDateReached = currentDate >= limitDate;

  useEffect(() => {
    let shouldUpdate = true;

    const loadSBT = async () => {
      if (account) {
        try {
          setIsLoading(true);
          await getNfts({ owner: account }).then((res) => {
            if (shouldUpdate) {
              setNftId(res.data[0].nftId);
              setIsNftDelegated(res.data[0].isDelegated);
            }
          });
        } catch (err) {
          console.error(
            `Error while fetching SBT - Details: ${getErrorMessage(err)}`
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSBT();
    return () => {
      shouldUpdate = false;
    };
  }, [account]);

  useEffect(() => {
    let shouldUpdate = true;

    const loadUser = async () => {
      try {
        if (isConnected && account !== undefined) {
          const res = await getUserById(account);
          const { user } = (await res.json()) as { user: IUser };
          const { timestampEnter, timestampExit } = user;
          if (shouldUpdate) {
            setHasEnter(timestampEnter !== null);
            setHasExit(timestampExit !== null);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadUser();
    return () => {
      shouldUpdate = false;
    };
  }, [isConnected, account]);

  if (isInitializing || isLoading) {
    return <GameSkeleton />;
  }

  if (!isConnected) {
    return <Connect />;
  }

  if (nftId === "") {
    return <NoSBTMessage />;
  }

  if (hasLimitDateReached) {
    return (
      <LimitReachedMessage
        isNftDelegated={isNftDelegated}
        nftId={Number.parseInt(nftId)}
        setIsNftDelegated={setIsNftDelegated}
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mx-8 text-center text-2xl font-light text-slate-300">
        {hasExit
          ? "Rewards will be distributed at the end of the game if you are eligible, good luck!"
          : hasEnter
          ? "Decide to go home when you want..."
          : "To join the game, delegate your NFT before October 28th."}
      </div>
      <GenericDelegateButton
        nftId={Number.parseInt(nftId)}
        disabled={hasEnter}
        recipient={process.env.NEXT_PUBLIC_DELEGATION_RECIPIENT}
        setHasEnter={setHasEnter}
      />
      {hasEnter && (
        <GenericDelegateButton disabled={hasExit} setHasExit={setHasExit} />
      )}
    </div>
  );
}

export function GameSkeleton() {
  return (
    <div className="flex">
      <Skeleton className="h-20 w-[200px] rounded-3xl" />
    </div>
  );
}

function NoSBTMessage() {
  return (
    <div className="mx-8 text-center text-2xl font-light text-slate-300">
      You need a Soulbound NFT to access the game
    </div>
  );
}

function LimitReachedMessage({
  isNftDelegated,
  nftId,
  setIsNftDelegated,
}: {
  isNftDelegated: boolean;
  nftId: number;
  setIsNftDelegated: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mx-8 text-center text-2xl font-light text-slate-300">
        {isNftDelegated
          ? "The game is closed now, you can still undelegate your NFT."
          : "It's now too late to enter the game."}
      </div>
      {isNftDelegated ? (
        <GenericDelegateButton
          nftId={nftId}
          setIsNftDelegated={setIsNftDelegated}
        />
      ) : (
        <GenericDelegateButton
          nftId={nftId}
          disabled
          recipient={process.env.NEXT_PUBLIC_DELEGATION_RECIPIENT}
        />
      )}
    </div>
  );
}

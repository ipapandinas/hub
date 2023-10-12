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
  const [nft, setNft] = useState<INft | undefined>(undefined);
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const currentDate = new Date();
  const limitDate = new Date(currentDate.getFullYear(), 9, 28);
  const hasLimitDateReached = currentDate >= limitDate;

  useEffect(() => {
    let shouldUpdate = true;

    const loadSBT = async () => {
      if (account) {
        try {
          setIsLoading(true);
          await getNfts({ owner: account }).then((res) => {
            if (shouldUpdate) setNft(res.data[0]);
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
    console.log("useEffect setUser");
    let shouldUpdate = true;

    const loadUser = async () => {
      try {
        if (isConnected && account !== undefined) {
          const res = await getUserById(account);
          const user = await res.json();
          if (shouldUpdate) setUser(user);
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

  if (nft === undefined) {
    return <NoSBTMessage />;
  }

  if (hasLimitDateReached) {
    return <LimitReachedMessage nft={nft} setNft={setNft} />;
  }

  console.log({user, check: user && user.timestampEnter &&  new Date(user.timestampEnter)})

  return (
    <div className="flex flex-col items-center">
      <div className="mx-8 text-center text-2xl font-light text-slate-300">
        {user?.timestampExit
          ? "Rewards will be distributed at the end of the game if you are eligible, good luck!"
          : user?.timestampEnter
          ? "Decide to go home when you want..."
          : "To join the game, delegate your NFT before October 28th."}
      </div>
      <GenericDelegateButton
        nftId={Number.parseInt(nft.nftId)}
        disabled={!!user?.timestampEnter}
        recipient={process.env.NEXT_PUBLIC_DELEGATION_RECIPIENT}
        setNft={setNft}
        setUser={setUser}
      />
      {user?.timestampEnter && (
        <GenericDelegateButton
          disabled={!!user?.timestampExit}
          setNft={setNft}
          setUser={setUser}
        />
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
  nft,
  setNft,
}: {
  nft: INft;
  setNft: Dispatch<SetStateAction<INft | undefined>>;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mx-8 text-center text-2xl font-light text-slate-300">
        {nft.isDelegated
          ? "The game is closed now, you can still undelegate your NFT."
          : "It's now too late to enter the game."}
      </div>
      {nft.isDelegated ? (
        <GenericDelegateButton
          nftId={Number.parseInt(nft.nftId)}
          setNft={setNft}
        />
      ) : (
        <GenericDelegateButton
          nftId={Number.parseInt(nft.nftId)}
          disabled
          recipient={process.env.NEXT_PUBLIC_DELEGATION_RECIPIENT}
        />
      )}
    </div>
  );
}

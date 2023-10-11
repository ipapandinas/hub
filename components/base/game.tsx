import { useEffect, useState } from "react";

import type { INft } from "../../lib/graphql";
import { getNfts } from "../../lib/graphql";
import { getErrorMessage } from "../../lib/utils";

import { useWalletConnectClient } from "../../hooks/useWalletConnectClient";

import { Connect } from "./connect";
import { GenericDelegateButton } from "./delegation";

export function Game() {
  const { account, disconnect, isConnected, isInitializing, isDisconnecting } =
  useWalletConnectClient();

  const [isClientReady, setIsClientReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nft, setNft] = useState<INft | undefined>(undefined);

  // const context = api.useContext();
  // const { data: user, isLoading: isUserLoading } = api.user.byId.useQuery(
  //   { userId: account ?? "" },
  //   { enabled: isClientReady && isConnected && account !== undefined },
  // );

  const currentDate = new Date();
  const limitDate = new Date(currentDate.getFullYear(), 9, 28);

  // const hasBeenDelegated =
  //   !!nft?.isDelegated || !!user?.data.user?.timestampEnter;
  // const hasBeenUndelegated =
  //   !!user?.data.user?.timestampExit && hasBeenDelegated;
  const hasLimitDateReached = currentDate >= limitDate;

  const onSuccess = async () => {
    setNft((prevState) => {
      if (prevState)
        return { ...prevState, isDelegated: !prevState.isDelegated };
    });
    // await context.user.byId.invalidate();
  };

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
            `Error while fetching SBT - Details: ${getErrorMessage(err)}`,
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

    if (shouldUpdate) setIsClientReady(true);

    return () => {
      shouldUpdate = false;
    };
  }, []);

  // if (!isClientReady || isInitializing) {
  //   return <GameSkeleton />;
  // }

  if (!isConnected) {
    return <Connect />;
  }

  // if (isLoading) {
  //   return <GameSkeleton />;
  // } else
  if (nft === undefined) {
    return (
      <>
        <div className="mx-8 text-center text-2xl font-light text-slate-300">
          You need a Soulbound NFT to access the game
        </div>
        <button
          className="mt-8"
          disabled={isDisconnecting}
          onClick={disconnect}
          // variant="link"
        >
          Disconnect wallet
        </button>
      </>
    );
  }
  // else if (hasLimitDateReached) {
  //   return (
  //     <div className="flex flex-col items-center">
  //       <div className="mx-8 text-center text-2xl font-light text-slate-300">
  //         {hasBeenDelegated && !hasBeenUndelegated
  //           ? "The game is closed now, you can still undelegate your NFT."
  //           : "It's now too late to delegate your NFT."}
  //       </div>
  //       {hasBeenDelegated && !hasBeenUndelegated ? (
  //         <GenericDelegateButton
  //           nftId={Number.parseInt(nft.nftId)}
  //           disabled={hasBeenUndelegated}
  //           onSuccess={onSuccess}
  //         />
  //       ) : (
  //         <GenericDelegateButton
  //           nftId={Number.parseInt(nft.nftId)}
  //           disabled
  //           recipient={env.NEXT_PUBLIC_DELEGATION_RECIPIENT}
  //           onSuccess={onSuccess}
  //         />
  //       )}
  //       <Button
  //         className="mt-8"
  //         disabled={isDisconnecting}
  //         onClick={disconnect}
  //         variant="link"
  //       >
  //         Disconnect wallet
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center">
      {/* <div className="mx-8 text-center text-2xl font-light text-slate-300">
        {hasBeenUndelegated
          ? "Rewards will be distributed at the end of the game if you are eligible, good luck!"
          : hasBeenDelegated
          ? "Decide to go home when you want..."
          : "To join the game, delegate your NFT before October 28th."}
      </div> */}
      <GenericDelegateButton
        nftId={Number.parseInt(nft.nftId)}
        // disabled={hasBeenDelegated}
        recipient={process.env.NEXT_PUBLIC_DELEGATION_RECIPIENT}
        onSuccess={onSuccess}
      />
      {/* {hasBeenDelegated && (
        <GenericDelegateButton disabled={hasBeenUndelegated} />
      )} */}
      <GenericDelegateButton nftId={Number.parseInt(nft.nftId)} />
      <button
        className="mt-8"
        disabled={isDisconnecting}
        onClick={disconnect}
        // variant="link"
      >
        Disconnect wallet
      </button>
    </div>
  );
}
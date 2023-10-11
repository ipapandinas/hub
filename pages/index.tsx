import { useState } from "react";
import { NextPage } from "next";
import { useWalletConnectClient } from "../hooks/useWalletConnectClient";
import { delegateNftTx, submitTxHex } from "ternoa-js";
import { retry } from "../utils/retry";

const Home: NextPage = () => {
  const { request: walletConnectRequest } = useWalletConnectClient();
  const {
    account,
    connect,
    disconnect,
    isDisconnecting,
    isInitializing,
    isConnected,
    isConnecting,
    isCreatingUri,
  } = useWalletConnectClient();

  const [loading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [hash, setHash] = useState("");
  const [signedHash, setSIgnedHash] = useState("");

  const delegateNft = async () => {
    setIsloading(true);
    try {
      const txHash = await delegateNftTx(
        82093,
        "5GN4m6Lfi6hCcLc9NrUqYKVoWCu2oim6TRT2UGcGoV9ftrUK"
      );
      setHash(txHash);
      const signedHash = await walletConnectRequest(txHash);
      setSIgnedHash(JSON.parse(signedHash).signedTxHash);
      await retry(submitTxHex, [JSON.parse(signedHash).signedTxHash]);
    } catch (err) {
      setError(JSON.stringify(err));
    } finally {
      setIsloading(false);
    }
  };

  const undelefateNft = async () => {
    setIsloading(true);
    try {
      const txHash = await delegateNftTx(82093);
      setHash(txHash);
      const signedHash = await walletConnectRequest(txHash);
      setSIgnedHash(JSON.parse(signedHash).signedTxHash);
      await retry(submitTxHex, [JSON.parse(signedHash).signedTxHash]);
    } catch (err) {
      setError(JSON.stringify(err));
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div>
      <div>Hello</div>
      {account && <span>{account}</span>}
      <br />
      <button onClick={() => connect(undefined)}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={delegateNft}>Delegate</button>
      <button onClick={undelefateNft}>Undelegate</button>
      <br />
      {loading && <span>{`error: ${loading}`}</span>}
      <br />
      {isDisconnecting && <span>{`isDisconnecting: ${isDisconnecting}`}</span>}
      <br />
      {isInitializing && <span>{`isInitializing: ${isInitializing}`}</span>}
      <br />
      {isConnected && <span>{`isConnected: ${isConnected}`}</span>}
      <br />
      {isConnecting && <span>{`isConnecting: ${isConnecting}`}</span>}
      <br />
      {isCreatingUri && <span>{`isCreatingUri: ${isCreatingUri}`}</span>}
      <br />
      {error && <span>{`error: ${error}`}</span>}
      <br />
      {hash && <span>{`hash: ${hash}`}</span>}
      <br />
      {signedHash && <span>{`signedHash: ${signedHash}`}</span>}
    </div>
  );
};

export default Home;

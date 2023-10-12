import { removeURLSlash } from "./string";

export const DAPP_NAME = "Wolf Hunters";
export const BLOCKCHAIN_URL = removeURLSlash(process.env.NEXT_PUBLIC_WS_NETWORK!);
export const IS_ALPHANET = BLOCKCHAIN_URL.includes("alphanet");
export const SIGNATURE_TIMEOUT = 60 * 1000;
export const IS_RN = typeof window !== 'undefined' && Boolean((window as any).isRNApp)
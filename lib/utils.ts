import type { NextApiRequest, NextApiResponse } from "next";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SignJWT, jwtVerify } from "jose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  if ((error as { message: string }).message)
    return (error as { message: string }).message;
  return String(error);
}

export async function fetchApi(route: string, body: any) {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
  const token = await new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1m")
    .sign(secret);
  return fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET),
    );
    return verified.payload; 
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(`Unable to verify JWT Token - Details: ${message}`);
  }
};

export const ensureAdminMiddleware = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  if (!token) {
    return res
    .status(500)
    .send({ error: "UNAUTHORIZED" });
  }

  const payload = await verifyToken(token);
  if (!payload.isAdmin) {
    return res
    .status(500)
    .send({ error: "UNAUTHORIZED" });
  }
};
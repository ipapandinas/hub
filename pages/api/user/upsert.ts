import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db";
import { ensureAdminMiddleware } from "../../../lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, timestampEnter, timestampExit } = req.body;
  const input = {
    ...(timestampEnter && { timestampEnter }),
    ...(timestampExit && { timestampExit }),
  };

  try {
    await ensureAdminMiddleware(req, res);
    const user = await db.user.upsert({
      where: { id },
      create: {
        id,
        ...input,
      },
      update: input,
    });

    res.status(200).send({ user });
  } catch (err: unknown) {
    const error = err as { code: string; message: string };
    if (error.code === "P2002") {
      res.status(500).send({ error: `User with id "${id}" already exists` });
    }

    throw err;
  }
}

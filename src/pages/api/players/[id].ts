// pages/api/players/[id].ts
import { PlayerModel } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import { Player } from "@/models/Player";
type UpdatePlayerBody = Partial<Player>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // first connect to the database
  await dbConnect();
  const id = req.query.id as string;
  if (req.method === "GET") {
    // for retrieving a single player
    const player = await PlayerModel.findById(id);
    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404);
    }
  } else if (req.method === "PUT") {
    // updating a single player
    const body = req.body as UpdatePlayerBody;
    const player = await PlayerModel.findById(id);
    if (player) {
        player.set({ ...body });
      await player.save();
      res.status(200).json(player.toJSON());
    } else {
      res.status(404);
    }
  } else if (req.method === "DELETE") {
    // deleting a single player
    const player = await PlayerModel.findByIdAndDelete(id);
    if (player) {
      res.status(200).json(player.toJSON());
    } else {
      res.status(404);
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

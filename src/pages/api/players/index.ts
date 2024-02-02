// pages/api/players/index.ts
import { PlayerModel } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
interface CreatePlayerBody {
  first_name: string;
  last_name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "GET") {
    // for retrieving players list
    const players = await PlayerModel.find({}).limit(16).lean();
    res.status(200).json(players);
  } else if (req.method === "POST") {
    // creating a single todo
    const body = req.body as CreatePlayerBody;
    const player = new PlayerModel({
      first_name: body.first_name,
      last_name: body.last_name,
    });
    await player.save();

    res.status(200).json(player.toJSON());
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
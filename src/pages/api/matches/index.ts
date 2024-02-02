// pages/api/matches/index.ts
import { MatchModel } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
export interface CreateMatchBody {
  player1: string;
  player2: string;
  games: {
    game_number: number;
    player1_score: number;
    player2_score: number;
  }[];
  winner: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "GET") {
    // for retrieving matches list
    const matches = await MatchModel.find({}).limit(100).lean();
    res.status(200).json(matches);
  } else if (req.method === "POST") {
    // creating a single match
    const body = req.body as CreateMatchBody;
    const match = new MatchModel({
      player1: body.player1,
      player2: body.player2,
    });
    await match.save();

    res.status(200).json(match.toJSON());
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
// pages/api/matches/[id].ts
import { MatchModel, PlayerModel, RoundModel } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import { Match } from "@/models/Match";
import { fetchPlayers } from "../rounds";
import { Player } from "@/models/Player";
type UpdateMatchBody = Partial<Match>;

async function rankPlayers() {
  const players: Player[] = await fetchPlayers()
  players.sort((a, b) => {
    if (a.roundPrimaryPoints !== b.roundPrimaryPoints) {
      return b.roundPrimaryPoints - a.roundPrimaryPoints;
    }
    return b.roundSecondaryPoints - a.roundSecondaryPoints;
  });


  //while the two players' primary points equal to secondary points they got same rank 
  let currentRank = 1;
  let lastPrimaryPoints: any = null;
  let lastSecondaryPoints: any = null;
  players.map(async (player, index) => {
    //both points same rank don't move to next
    if (index > 0 &&
      (player.roundPrimaryPoints !== lastPrimaryPoints ||
        player.roundSecondaryPoints !== lastSecondaryPoints)) {
      currentRank = index + 1;
    }
    lastPrimaryPoints = player.roundPrimaryPoints;
    lastSecondaryPoints = player.roundSecondaryPoints;
    await PlayerModel.updateOne(
      { _id: player._id },
      {
        $set: {
          rank: currentRank
        }
      }
    );
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // first connect to the database
  await dbConnect();
  const id = req.query.id as string;
  if (req.method === "GET") {
    // for retrieving a single match
    const match = await MatchModel.findById(id);
    if (match) {
      res.status(200).json(match);
    } else {
      res.status(404);
    }
  } else if (req.method === "PUT") {
    // updating a single match
    const body = req.body as UpdateMatchBody;
    const match = await MatchModel.findById(id);
    if (match) {
      match.set({ ...body, isCompleted: true });
      await match.save();

      //calculate the primary point and secondary point after every matches updated 
      const primaryPointsForPlayer1 = match.winner === match.player1 ? 1 : 0;
      const primaryPointsForPlayer2 = match.winner === match.player2 ? 1 : 0;

      let secondaryPointsForPlayer1 = 0;
      let secondaryPointsForPlayer2 = 0;

      match.games.forEach(game => {
        secondaryPointsForPlayer1 += game.player1_score - game.player2_score;
        secondaryPointsForPlayer2 += game.player2_score - game.player1_score;
      });

      await PlayerModel.updateOne(
        { _id: match.player1 },
        {
          $inc: {
            roundPrimaryPoints: primaryPointsForPlayer1,
            roundSecondaryPoints: secondaryPointsForPlayer1
          }
        }
      );

      await PlayerModel.updateOne(
        { _id: match.player2 },
        {
          $inc: {
            roundPrimaryPoints: primaryPointsForPlayer2,
            roundSecondaryPoints: secondaryPointsForPlayer2
          }
        }
      );

      //recalculate rank
      rankPlayers();

      res.status(200).json(match.toJSON());
    } else {
      res.status(404);
    }
  } else if (req.method === "DELETE") {
    // deleting a single match
    const match = await MatchModel.findByIdAndDelete(id);
    if (match) {
      res.status(200).json(match.toJSON());
    } else {
      res.status(404);
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

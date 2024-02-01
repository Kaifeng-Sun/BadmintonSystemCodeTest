// pages/api/rounds/index.ts
import { MatchModel, RoundModel, PlayerModel } from "@/models";
import { Match } from "@/models/Match";
import { Player } from "@/models/Player";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";

export async function fetchPlayers() {
  const response = await fetch('http://localhost:3000/api/players');
  const players = await response.json();
  return players;
}

async function findPreviousOpponents(id: string) {
  const response = await fetch(`http://localhost:3000/api/players/${id}`);
  const player = await response.json() as Player;
  const matchIds = player.matchIds;

  let previousOpponents = new Set<string>();

  if (matchIds) {
    for (const matchId of matchIds) {
      const matchResponse = await fetch(`http://localhost:3000/api/matches/${matchId}`);
      const match = await matchResponse.json() as Match;

      const opponentId = match.player1 === id ? match.player2 : match.player1;
      previousOpponents.add(opponentId);
    }
  }

  return previousOpponents;
}

async function pairPlayers(players: Player[]) {
  let pairedPlayers = [];
  let usedPlayers = new Set();

  for (let player of players) {
    if (usedPlayers.has(player._id)) continue;
    console.log(usedPlayers);

    const previousOpponents = player.previous_opponents;
    
    let potentialOpponents = players.filter(p =>
      p._id !== player._id &&
      Math.abs(p.rank - player.rank) < 10 &&
      !previousOpponents.includes(p._id) &&
      !usedPlayers.has(p._id)
    );
      
    if (potentialOpponents.length > 0) {
      let opponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];
      usedPlayers.add(player._id);
      usedPlayers.add(opponent._id);
      pairedPlayers.push({ player1: player, player2: opponent });
    }
  }
  return pairedPlayers;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    // for retrieving rounds list
    const rounds = await RoundModel.find({}).limit(10).lean();
    res.status(200).json(rounds);
  } else if (req.method === "POST") {
    //TODO:if matches of last round are not all completed then cannot create a new round 

    //generate matches schedule and create those matches to the db for new round
    const players: Player[] = await fetchPlayers();
    const pairedPlayers = await pairPlayers(players);

    pairedPlayers.forEach(async (pairedPlayer) => {
      const match = new MatchModel({
        player1: pairedPlayer.player1._id,
        player2: pairedPlayer.player2._id,
        games: [],
        winner: '',
      });
      await match.save();

      //add match id to the player
      await PlayerModel.updateOne({ _id: pairedPlayer.player1._id }, { $push: { matchIds: match._id, previous_opponents: pairedPlayer.player2._id } });
      await PlayerModel.updateOne({ _id: pairedPlayer.player2._id }, { $push: { matchIds: match._id, previous_opponents: pairedPlayer.player1._id } });
    })

    // creating a single round
    const round = new RoundModel({
      matches: pairedPlayers
    });
    await round.save();

    res.status(200).json(round.toJSON());
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
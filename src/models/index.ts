// models/index.ts
import { getModelForClass } from "@typegoose/typegoose";
import { Match } from "./Match";
import { Player } from "./Player";
import { Round } from "./Round";
import { Tournament } from "./Tournament";

export const MatchModel = getModelForClass(Match);
export const PlayerModel = getModelForClass(Player);
export const RoundModel = getModelForClass(Round);
export const TournamentModel = getModelForClass(Tournament);
// add other models here

// models/index.ts
import { getModelForClass } from "@typegoose/typegoose";
import { Match } from "./Match";
import { Player } from "./Player";
import { Round } from "./Round";

export const MatchModel = getModelForClass(Match);
export const PlayerModel = getModelForClass(Player);
export const RoundModel = getModelForClass(Round);
// add other models here

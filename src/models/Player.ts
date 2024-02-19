import { prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { Match, Tournament } from "./Tournament";

export class PlayerTournamentScore {
  @prop({ ref: () => Tournament })
  tournament?: Ref<Tournament>;

  @prop({ default: 0 })
  roundPrimaryPoints: number;

  @prop({ default: 0 })
  roundSecondaryPoints: number;
}

export class Player {
  @prop({ required: true })
  first_name: string;

  @prop({ required: true })
  last_name: string;

  @prop()
  gender?: string;

  @prop({ type: () => [PlayerTournamentScore]})
  scores?: PlayerTournamentScore[];
  

  @prop({ ref: () => Match })
  matchIds?: Ref<Match>[];

  @prop()
  previous_opponents?: string[];
}
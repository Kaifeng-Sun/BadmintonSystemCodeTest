import { prop, Ref } from "@typegoose/typegoose";
import { Player } from "./Player";

export class Game {
  @prop({ required: true })
  game_number: number;

  @prop({ required: true })
  player1_score: number;

  @prop({ required: true })
  player2_score: number;
}

export class Match {
  @prop({ ref: () => Player })
  player1?: Ref<Player>[];

  @prop({ ref: () => Player })
  player2?: Ref<Player>[];

  @prop({ type: () => [Game]})
  games?: Game[];

  @prop()
  winner?: string;

  @prop({ default: false })
  isCompleted: boolean;
}

export class Round {
  @prop({ unique: true})
  round_number: number;

  @prop({ type: () => [Match], required: true })
  matches?: Match[];

  @prop({ default: false })
  isCompleted: string;
}

export class Tournament {
  @prop({ ref: () => Player })
  players?: Ref<Player>[];

  @prop({ type: () => [Round], required: true })
  rounds?: Round[];
}
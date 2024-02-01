import { prop } from "@typegoose/typegoose";

export class Game {
  @prop({ required: true })
  public game_number: number;

  @prop({ required: true })
  public player1_score: number;

  @prop({ required: true })
  public player2_score: number;
}

export class Match {
  @prop()
  round_number: number;

  @prop({ required: true })
  player1: string;

  @prop({ required: true })
  player2: string;

  @prop({ type: () => [Game], required: true })
  games!: Game[];

  @prop()
  winner: string;

  @prop({ default: false })
  isCompleted: boolean;
}
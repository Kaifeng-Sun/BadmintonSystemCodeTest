import { prop, Ref } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import { Match } from "./Match";

export class Player {
  @prop({ default: () => nanoid(8) })
  _id: string;

  @prop({ required: true })
  first_name: string;

  @prop({ required: true })
  last_name: string;

  @prop()
  dob: string;

  @prop()
  gender: string;
  
  @prop({ default: 0 })
  roundPrimaryPoints: number;
  
  @prop({ default: 0 })
  roundSecondaryPoints: number;

  @prop({ default: 1 })
  rank: number;

  @prop({ ref: () => Match, default: [] })
  public matchIds?: Ref<Match>[];

  @prop({ default: [] })
  previous_opponents: string[];

}
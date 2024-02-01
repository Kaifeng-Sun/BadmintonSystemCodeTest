import { pre, prop, Ref } from "@typegoose/typegoose";
import { RoundModel } from ".";
import { Match } from "./Match";

@pre<Round>('save', async function () {
  // auto increment before save a new round
  if (this.isNew) {
    const largestRound = await RoundModel.findOne().sort('-round_number').exec();
    this.round_number = largestRound ? largestRound.round_number + 1 : 1;
  }
})

export class Round {
  @prop()
  round_number: number;

  @prop({ type: () => [Match], required: true })
  public matches?: Ref<Match>[];

  @prop({ default: false })
  isCompleted: string;
}
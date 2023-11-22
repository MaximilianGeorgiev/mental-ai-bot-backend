import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DailyTask } from "src/types/interfaces/entities/plans";

export type MessageDocument = HydratedDocument<SelfCarePlan>;

@Schema()
export class SelfCarePlan {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  progress: number;

  @Prop({ required: true })
  isCompleted: boolean;

  @Prop({ required: true })
  targetDate: Date;

  @Prop({ required: true })
  dailyTasks: DailyTask[];

  @Prop()
  userId?: string; // bind foreign key
}

export const SelfCarePlanSchema = SchemaFactory.createForClass(SelfCarePlan);

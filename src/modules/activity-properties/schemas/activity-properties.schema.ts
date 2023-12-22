import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Activity, ActivityMetric } from "src/types/user-properties.type";

export type MessageDocument = HydratedDocument<ActivityProperties>;

@Schema()
export class ActivityProperties {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  activityName: Activity;

  @Prop()
  benefits: string; // description of the benefits of said activity

  @Prop()
  metric: ActivityMetric; // how is progress measured (miles, minutes, pages)

  @Prop()
  metricQuantityLight: number;

  @Prop()
  metricQuantityModerate: number;

  @Prop()
  metricQuantityIntense: number;

  @Prop()
  resources?: string[]; // recommended books, music links etc.
}

export const ActivityPropertiesSchema =
  SchemaFactory.createForClass(ActivityProperties);

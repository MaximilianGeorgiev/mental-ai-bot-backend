import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Activity, Gender, Goal } from "src/types/user-properties.type";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  gender: Gender;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  preferedActivities: Activity[];

  @Prop({ required: true })
  goals: Goal[];

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

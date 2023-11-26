import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type MessageDocument = HydratedDocument<IssuedToken>;

@Schema()
export class IssuedToken {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop()
  userId: string; // bind foreign key

  @Prop()
  token: string;
}

export const IssuedTokenSchema = SchemaFactory.createForClass(IssuedToken);

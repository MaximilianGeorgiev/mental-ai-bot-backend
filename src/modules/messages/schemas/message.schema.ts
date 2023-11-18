import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MessageType } from "src/types/messages.type";

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  _id: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  type: MessageType;

  @Prop()
  response?: Message;

  @Prop()
  userId?: string; // bind foreign key
}

export const MessageSchema = SchemaFactory.createForClass(Message);

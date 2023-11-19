import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Message } from "src/modules/messages/schemas/message.schema";

export type MessageDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop()
  _id: string;

  @Prop({ required: true })
  dateCreated: Date;

  @Prop({ required: true, default: [] })
  messages: Message[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: false })
  isArchived: boolean;

  @Prop()
  userId?: string; // bind foreign key
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

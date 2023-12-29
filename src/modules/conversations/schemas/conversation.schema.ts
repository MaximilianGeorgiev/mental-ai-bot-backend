import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Message } from "src/modules/messages/schemas/message.schema";

export type MessageDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  dateCreated: Date;

  @Prop({ default: [] })
  messages: Message[];

  @Prop({ default: "New conversation" })
  title: string;

  @Prop({ required: true, default: false })
  isArchived: boolean;

  @Prop()
  userId?: string; // bind foreign key

  @Prop()
  isGuest: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

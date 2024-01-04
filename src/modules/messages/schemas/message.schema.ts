import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { MessageType } from "src/types/messages.type";
import { Message as MessageInterface } from "src/types/interfaces/entities/messages";

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  type: MessageType;

  @Prop({ type: Object })
  response?: MessageInterface;

  @Prop()
  userId?: string; // bind foreign key

  @Prop()
  conversationId: string; // bind foreign key
}

export const MessageSchema = SchemaFactory.createForClass(Message);

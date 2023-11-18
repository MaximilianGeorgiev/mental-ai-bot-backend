import { MessageType } from "src/types/messages.type";

export interface Message {
  _id: string;
  timestamp: Date;
  message: string;
  type: MessageType;
  response?: Message;
  userId?: string; // bind foreign key
}

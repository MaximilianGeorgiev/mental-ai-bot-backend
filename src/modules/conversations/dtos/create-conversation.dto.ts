import { Message } from "src/types/interfaces/entities/messages";

export interface CreateConversationDto {
  _id: string;
  dateCreated: Date;
  messages: Message[];
  title: string;
  isArchived: boolean;
  userId?: string; // bind foreign key
}

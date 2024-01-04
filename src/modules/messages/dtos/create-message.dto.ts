export interface CreateMessageDto {
  _id: string;
  timestamp: Date;
  message: string;
  userId?: string; // bind foreign key
  conversationId: string;
}

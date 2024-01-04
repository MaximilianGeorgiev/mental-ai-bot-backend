import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { Message, MessageSchema } from "./schemas/message.schema";
import { AiService } from "../ai/services/main.service";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AiModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, AiService],
})
export class MessagesModule {}

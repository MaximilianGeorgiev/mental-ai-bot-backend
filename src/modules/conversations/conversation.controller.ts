import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import {
  isResponseInstanceOfConversation,
  isServiceOutcome,
} from "src/types/guards/database-responses";
import { Conversation } from "./schemas/conversation.schema";
import { CreateConversationDto } from "./dtos/create-conversation.dto";

@Controller("conversations")
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get("/:column/:searchValue")
  async findByProperty(
    @Param("column") column: string,
    @Param("searchValue") searchValue: string,
  ): Promise<void | Conversation[] | []> {
    const response = await this.conversationService.find(column, searchValue);

    if (response === null) return [];
    else if (isResponseInstanceOfConversation(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Get()
  async findAll(): Promise<void | Conversation[]> {
    const response = await this.conversationService.findAll();

    if (response === null) return [];
    else if (isResponseInstanceOfConversation(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Post()
  async create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<void | Conversation> {
    const response = await this.conversationService.create(
      createConversationDto,
    );

    if (isResponseInstanceOfConversation(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Put(":id")
  async update(
    @Body("column") column: string,
    @Body("updateValue") updateValue: string,
    @Param("id") conversationId: string,
  ): Promise<void | Conversation | []> {
    if (!column || !updateValue || !conversationId)
      throw new HttpException(
        "Invalid parameters to process update operation.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const response = await this.conversationService.update(
      conversationId,
      column,
      updateValue,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfConversation(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Delete(":id")
  async delete(@Param("id") conversationId: string): Promise<string | void> {
    const response = await this.conversationService.delete(conversationId);

    if (isServiceOutcome(response)) return response.message;
    else if (response instanceof HttpException) throw response;
  }
}

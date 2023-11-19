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
import { MessageService } from "./message.service";
import {
  isResponseInstanceOfMessage,
  isServiceOutcome,
} from "src/types/guards/database-responses";
import { Message } from "./schemas/message.schema";
import { CreateMessageDto } from "./dtos/create-message.dto";

@Controller("messages")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get("/:column/:searchValue")
  async findByProperty(
    @Param("column") column: string,
    @Param("searchValue") searchValue: string,
  ): Promise<void | Message[] | []> {
    const response = await this.messageService.find(column, searchValue);

    if (response === null) return [];
    else if (isResponseInstanceOfMessage(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Get()
  async findAll(): Promise<void | Message[]> {
    const response = await this.messageService.findAll();

    if (response === null) return [];
    else if (isResponseInstanceOfMessage(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<void | Message> {
    const response = await this.messageService.create(createMessageDto);

    if (isResponseInstanceOfMessage(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Put(":messageId")
  async update(
    @Body("column") column: string,
    @Body("updateValue") updateValue: string,
    @Param("messageId") messageId: string,
  ): Promise<void | Message | []> {
    if (!column || !updateValue || !messageId)
      throw new HttpException(
        "Invalid parameters to process update operation.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const response = await this.messageService.update(
      messageId,
      column,
      updateValue,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfMessage(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Delete(":messageId")
  async delete(@Param("messageId") messageId: string): Promise<string | void> {
    const response = await this.messageService.delete(messageId);

    if (isServiceOutcome(response)) return response.message;
    else if (response instanceof HttpException) throw response;
  }
}

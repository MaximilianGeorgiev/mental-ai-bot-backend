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
  Query,
  UseGuards,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import {
  isResponseInstanceOfMessage,
  isServiceOutcome,
} from "src/types/guards/database-responses";
import { Message } from "./schemas/message.schema";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("messages")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Get("/:column/:searchValue")
  async findByProperty(
    @Param("column") column: string,
    @Param("searchValue") searchValue: string,
    @Query("many") findMany: boolean,
  ): Promise<void | Message[] | Message | []> {
    const response = await this.messageService.find(
      column,
      searchValue,
      findMany,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfMessage(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("admin"))
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

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Put(":id")
  async update(
    @Body("column") column: string,
    @Body("updateValue") updateValue: string,
    @Param("id") messageId: string,
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

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Delete(":id")
  async delete(@Param("id") messageId: string): Promise<string | void> {
    const response = await this.messageService.delete(messageId);

    if (isServiceOutcome(response)) return response.message;
    else if (response instanceof HttpException) throw response;
  }
}

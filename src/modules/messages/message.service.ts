import { Model } from "mongoose";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";
import { Message } from "./schemas/message.schema";
import { AiService } from "../ai/services/main.service";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @Inject(AiService) private readonly aiService: AiService,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
  ): Promise<Message | HttpException> {
    try {
      const createdMessage = new this.messageModel(createMessageDto);
      return await createdMessage.save();
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async find(
    databaseColumn: string,
    columnValue: string,
    findMany = true,
  ): Promise<Message[] | Message | null> {
    const result = await this.messageModel
      .find({ [databaseColumn]: columnValue })
      .exec();

    if (!findMany && result.length > 0) return result[0];
    else if (!findMany) return null;
    else return result;
  }

  async update(
    messageId: string,
    databaseColumn: string,
    columnValue: string,
  ): Promise<Message | HttpException | null> {
    try {
      return this.messageModel.findOneAndUpdate(
        { _id: messageId },
        { $set: { [databaseColumn]: columnValue } },
      );
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(
    messageId: string,
  ): Promise<HttpException | ServiceOperationOutcome> {
    const result = await this.messageModel.findByIdAndRemove(messageId);

    if (!result)
      return new HttpException(
        "Specified ID not found",
        HttpStatus.BAD_REQUEST,
      );
    else {
      return {
        success: true,
        message: "Message with specified ID successfully removed.",
      };
    }
  }
}

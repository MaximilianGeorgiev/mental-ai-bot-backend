import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";
import { Message } from "./schemas/message.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
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
  ): Promise<Message[] | null> {
    return this.messageModel.find({ [databaseColumn]: columnValue }).exec();
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

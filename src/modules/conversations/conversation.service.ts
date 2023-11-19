import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateConversationDto } from "./dtos/create-conversation.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";
import { Conversation } from "./schemas/conversation.schema";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation | HttpException> {
    try {
      const createdMessage = new this.conversationModel(createConversationDto);
      return await createdMessage.save();
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversationModel.find().exec();
  }

  async find(
    databaseColumn: string,
    columnValue: string,
  ): Promise<Conversation[] | null> {
    return this.conversationModel
      .find({ [databaseColumn]: columnValue })
      .exec();
  }

  async update(
    conversationId: string,
    databaseColumn: string,
    columnValue: string,
  ): Promise<Conversation | HttpException | null> {
    try {
      return this.conversationModel.findOneAndUpdate(
        { _id: conversationId },
        { $set: { [databaseColumn]: columnValue } },
      );
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(
    conversationId: string,
  ): Promise<HttpException | ServiceOperationOutcome> {
    const result =
      await this.conversationModel.findByIdAndRemove(conversationId);

    if (!result)
      return new HttpException(
        "Specified ID not found",
        HttpStatus.BAD_REQUEST,
      );
    else {
      return {
        success: true,
        message: "Conversation with specified ID successfully removed.",
      };
    }
  }
}

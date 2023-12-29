import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateConversationDto } from "./dtos/create-conversation.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";
import { Conversation } from "./schemas/conversation.schema";
import { toObjectId } from "src/utils/database";

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
    findMany = true,
  ): Promise<Conversation[] | Conversation | null> {
    const result = await this.conversationModel
      .find({
        [databaseColumn]:
          databaseColumn === "_id" ? toObjectId(columnValue) : columnValue,
      })
      .exec();

    if (!findMany && result.length > 0) return result[0];
    else if (!findMany) return null;
    else return result;
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

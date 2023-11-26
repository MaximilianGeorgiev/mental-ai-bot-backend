import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateTokenDto } from "./dtos/create-token.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";
import { IssuedToken } from "./schemas/issued-tokens.schema";

@Injectable()
export class IssuedTokensService {
  constructor(
    @InjectModel(IssuedToken.name)
    private issuedTokenModel: Model<IssuedToken>,
  ) {}

  async create(
    createTokenDto: CreateTokenDto,
  ): Promise<IssuedToken | HttpException> {
    try {
      const createdMessage = new this.issuedTokenModel(createTokenDto);
      return await createdMessage.save();
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(): Promise<IssuedToken[]> {
    return this.issuedTokenModel.find().exec();
  }

  async find(
    databaseColumn: string,
    columnValue: string,
  ): Promise<IssuedToken[] | null> {
    return this.issuedTokenModel.find({ [databaseColumn]: columnValue }).exec();
  }

  async update(
    issuedTokenId: string,
    databaseColumn: string,
    columnValue: string,
  ): Promise<IssuedToken | HttpException | null> {
    try {
      return this.issuedTokenModel.findOneAndUpdate(
        { _id: issuedTokenId },
        { $set: { [databaseColumn]: columnValue } },
      );
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(
    issuedTokenId: string,
  ): Promise<HttpException | ServiceOperationOutcome> {
    const result = await this.issuedTokenModel.findByIdAndRemove(issuedTokenId);

    if (!result)
      return new HttpException(
        "Specified ID not found",
        HttpStatus.BAD_REQUEST,
      );
    else {
      return {
        success: true,
        message: "Issued token with specified ID successfully removed.",
      };
    }
  }
}

import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createCatDto: CreateUserDto): Promise<User | HttpException> {
    try {
      const createdCat = new this.userModel(createCatDto);
      return await createdCat.save();
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async find(
    databaseColumn: string,
    columnValue: string,
  ): Promise<User[] | null> {
    return this.userModel.find({ [databaseColumn]: columnValue }).exec();
  }

  async update(
    userId: string,
    databaseColumn: string,
    columnValue: string,
  ): Promise<User | HttpException | null> {
    try {
      return this.userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { [databaseColumn]: columnValue } },
      );
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(
    userId: string,
  ): Promise<HttpException | ServiceOperationOutcome> {
    const result = await this.userModel.findByIdAndRemove(userId);

    if (!result)
      return new HttpException(
        "Specified ID not found",
        HttpStatus.BAD_REQUEST,
      );
    else {
      return {
        success: true,
        message: "User with specified ID successfully removed.",
      };
    }
  }
}

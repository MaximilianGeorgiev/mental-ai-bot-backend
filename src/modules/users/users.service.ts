import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class CatsService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createCatDto: CreateUserDto): Promise<User> {
    const createdCat = new this.userModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}

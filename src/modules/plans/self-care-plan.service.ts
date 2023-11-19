import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SelfCarePlan } from "./schemas/self-care-plan.schema";
import { CreateSelfCarePlanDto } from "./dtos/create-self-care-plan.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";

@Injectable()
export class SelfCarePlanService {
  constructor(
    @InjectModel(SelfCarePlan.name) private planModel: Model<SelfCarePlan>,
  ) {}

  async create(
    createPlanDto: CreateSelfCarePlanDto,
  ): Promise<SelfCarePlan | HttpException> {
    try {
      const createdPlan = new this.planModel(createPlanDto);
      return await createdPlan.save();
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(): Promise<SelfCarePlan[]> {
    return this.planModel.find().exec();
  }

  async find(
    databaseColumn: string,
    columnValue: string,
  ): Promise<SelfCarePlan[] | null> {
    return this.planModel.find({ [databaseColumn]: columnValue }).exec();
  }

  async update(
    selfCarePlanId: string,
    databaseColumn: string,
    columnValue: string,
  ): Promise<SelfCarePlan | HttpException | null> {
    try {
      return this.planModel.findOneAndUpdate(
        { _id: selfCarePlanId },
        { $set: { [databaseColumn]: columnValue } },
      );
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(
    selfCarePlanId: string,
  ): Promise<HttpException | ServiceOperationOutcome> {
    const result = await this.planModel.findByIdAndRemove(selfCarePlanId);

    if (!result)
      return new HttpException(
        "Specified ID not found",
        HttpStatus.BAD_REQUEST,
      );
    else {
      return {
        success: true,
        message: "Self care plan with specified ID successfully removed.",
      };
    }
  }
}

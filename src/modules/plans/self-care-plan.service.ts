import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SelfCarePlan } from "./schemas/self-care-plan.schema";
import { CreateSelfCarePlanDto } from "./dtos/create-self-care-plan.dto";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";
import { toObjectId } from "src/utils/database";

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
    findMany = true,
  ): Promise<SelfCarePlan[] | SelfCarePlan | null> {
    const result = await this.planModel
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
    selfCarePlanId: string,
    databaseColumn: string,
    columnValue: string | SelfCarePlan,
  ): Promise<SelfCarePlan | HttpException | null> {
    try {
      // allow partial updates by column where databaseColumn specifies column and columnValue specified new value
      // if databaseColumn is "object" then columnValue will be the entire new object which will be replaced
      const replaceObject = databaseColumn === "object" ? true : false;

      return this.planModel.findOneAndUpdate(
        { _id: toObjectId(selfCarePlanId) },
        {
          $set: replaceObject
            ? { ...(columnValue as SelfCarePlan), _id: undefined }
            : { [databaseColumn]: columnValue },
        },
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

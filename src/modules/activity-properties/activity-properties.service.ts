import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";
import { ActivityProperties } from "./schemas/activity-properties.schema";
import { CreateActivityPropertyDto } from "./dtos/activity-properties.dto";

@Injectable()
export class ActivityPropertiesService {
  constructor(
    @InjectModel(ActivityProperties.name)
    private activityPropertiesModel: Model<ActivityProperties>,
  ) {}

  async create(
    createActivityPropertyDto: CreateActivityPropertyDto,
  ): Promise<ActivityProperties | HttpException> {
    try {
      const createdActivityProperty = new this.activityPropertiesModel(
        createActivityPropertyDto,
      );
      return await createdActivityProperty.save();
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(): Promise<ActivityProperties[]> {
    return this.activityPropertiesModel.find().exec();
  }

  async find(
    databaseColumn: string,
    columnValue: string,
    findMany = true,
  ): Promise<ActivityProperties[] | ActivityProperties | null> {
    const result = await this.activityPropertiesModel
      .find({ [databaseColumn]: columnValue })
      .exec();

    if (!findMany && result.length > 0) return result[0];
    else if (!findMany) return null;
    else return result;
  }

  async update(
    activityPropertyId: string,
    databaseColumn: string,
    columnValue: string,
  ): Promise<ActivityProperties | HttpException | null> {
    try {
      return this.activityPropertiesModel.findOneAndUpdate(
        { _id: activityPropertyId },
        { $set: { [databaseColumn]: columnValue } },
      );
    } catch (err) {
      return new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(
    activityPropertyId: string,
  ): Promise<HttpException | ServiceOperationOutcome> {
    const result =
      await this.activityPropertiesModel.findByIdAndRemove(activityPropertyId);

    if (!result)
      return new HttpException(
        "Specified ID not found",
        HttpStatus.BAD_REQUEST,
      );
    else {
      return {
        success: true,
        message: "Activity with specified ID successfully removed.",
      };
    }
  }
}

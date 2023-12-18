import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  isResponseInstanceOfActivityProperties,
  isServiceOutcome,
} from "src/types/guards/database-responses";
import { ActivityProperties } from "./schemas/activity-properties.schema";
import { CreateActivityPropertyDto } from "./dtos/activity-properties.dto";
import { AuthGuard } from "@nestjs/passport";
import { ActivityPropertiesService } from "./activity-properties.service";

@Controller("activities")
export class ActivityPropertiesController {
  constructor(private activityPropertiesService: ActivityPropertiesService) {}

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Get("/:column/:searchValue")
  async findByProperty(
    @Param("column") column: string,
    @Param("searchValue") searchValue: string,
    @Query("many") findMany: boolean,
  ): Promise<void | ActivityProperties[] | ActivityProperties | []> {
    const response = await this.activityPropertiesService.find(
      column,
      searchValue,
      findMany,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfActivityProperties(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("admin"))
  @Get()
  async findAll(): Promise<void | ActivityProperties[]> {
    const response = await this.activityPropertiesService.findAll();

    if (response === null) return [];
    else if (isResponseInstanceOfActivityProperties(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Post()
  async create(
    @Body() createActivityPropertiesDto: CreateActivityPropertyDto,
  ): Promise<void | ActivityProperties> {
    const response = await this.activityPropertiesService.create(
      createActivityPropertiesDto,
    );

    if (isResponseInstanceOfActivityProperties(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Put(":id")
  async update(
    @Body("column") column: string,
    @Body("updateValue") updateValue: string,
    @Param("id") activityPropertyId: string,
  ): Promise<void | ActivityProperties | []> {
    if (!column || !updateValue || !activityPropertyId)
      throw new HttpException(
        "Invalid parameters to process update operation.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const response = await this.activityPropertiesService.update(
      activityPropertyId,
      column,
      updateValue,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfActivityProperties(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Delete(":id")
  async delete(
    @Param("id") activityPropertyId: string,
  ): Promise<string | void> {
    const response =
      await this.activityPropertiesService.delete(activityPropertyId);

    if (isServiceOutcome(response)) return response.message;
    else if (response instanceof HttpException) throw response;
  }
}

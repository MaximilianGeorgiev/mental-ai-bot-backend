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
  UseInterceptors,
} from "@nestjs/common";
import { CreateSelfCarePlanDto } from "./dtos/create-self-care-plan.dto";
import { SelfCarePlanService } from "./self-care-plan.service";
import { SelfCarePlan } from "./schemas/self-care-plan.schema";
import {
  isResponseInstanceOfSelfCarePlan,
  isServiceOutcome,
} from "src/types/guards/database-responses";
import { AuthGuard } from "@nestjs/passport";
import { EntityOwnerMiddleware } from "src/middlewares/entity-owner.middleware";

@Controller("plans")
export class SelfCarePlanController {
  constructor(private selfCarePlanService: SelfCarePlanService) {}

  @Get("/:column/:searchValue")
  async findByProperty(
    @Param("column") column: string,
    @Param("searchValue") searchValue: string,
    @Query("many") findMany: boolean,
  ): Promise<void | SelfCarePlan[] | SelfCarePlan | []> {
    const response = await this.selfCarePlanService.find(
      column,
      searchValue,
      findMany,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfSelfCarePlan(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("admin"))
  @Get()
  async findAll(): Promise<void | SelfCarePlan[]> {
    const response = await this.selfCarePlanService.findAll();

    if (response === null) return [];
    else if (isResponseInstanceOfSelfCarePlan(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Post()
  async create(
    @Body() createSelfCarePlanDto: CreateSelfCarePlanDto,
  ): Promise<void | SelfCarePlan> {
    const response = await this.selfCarePlanService.create(
      createSelfCarePlanDto,
    );

    if (isResponseInstanceOfSelfCarePlan(response))
      return response as SelfCarePlan;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(EntityOwnerMiddleware)
  @Put(":id")
  async update(
    @Body("column") column: string,
    @Body("updateValue") updateValue: string,
    @Param("id") selfCarePlanId: string,
  ): Promise<void | SelfCarePlan | []> {
    if (!column || !updateValue || !selfCarePlanId)
      throw new HttpException(
        "Invalid parameters to process update operation.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const response = await this.selfCarePlanService.update(
      selfCarePlanId,
      column,
      updateValue,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfSelfCarePlan(response))
      return response as SelfCarePlan;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Delete(":id")
  async delete(@Param("id") selfCarePlanId: string): Promise<string | void> {
    const response = await this.selfCarePlanService.delete(selfCarePlanId);

    if (isServiceOutcome(response)) return response.message;
    else if (response instanceof HttpException) throw response;
  }
}

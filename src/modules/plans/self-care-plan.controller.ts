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
} from "@nestjs/common";
import { CreateSelfCarePlanDto } from "./dtos/create-self-care-plan.dto";
import { SelfCarePlanService } from "./self-care-plan.service";
import { SelfCarePlan } from "./schemas/self-care-plan.schema";
import {
  isResponseInstanceOfSelfCarePlan,
  isServiceOutcome,
} from "src/types/guards/database-responses";

@Controller("plans")
export class SelfCarePlanController {
  constructor(private selfCarePlanService: SelfCarePlanService) {}

  @Get("/:column/:searchValue")
  async findByProperty(
    @Param("column") column: string,
    @Param("searchValue") searchValue: string,
  ): Promise<void | SelfCarePlan[] | []> {
    const response = await this.selfCarePlanService.find(column, searchValue);

    if (response === null) return [];
    else if (isResponseInstanceOfSelfCarePlan(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

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

    if (isResponseInstanceOfSelfCarePlan(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Put(":selfCarePlanId")
  async update(
    @Body("column") column: string,
    @Body("updateValue") updateValue: string,
    @Param("selfCarePlanId") selfCarePlanId: string,
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
    else if (isResponseInstanceOfSelfCarePlan(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Delete(":selfCarePlanId")
  async delete(@Param("selfCarePlanId") selfCarePlanId: string): Promise<any> {
    const response = await this.selfCarePlanService.delete(selfCarePlanId);

    if (isServiceOutcome(response)) return response.message;
    else if (response instanceof HttpException) throw response;
  }
}

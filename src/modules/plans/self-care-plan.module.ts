import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SelfCarePlanController } from "./self-care-plan.controller";
import { SelfCarePlanService } from "./self-care-plan.service";
import {
  SelfCarePlan,
  SelfCarePlanSchema,
} from "./schemas/self-care-plan.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SelfCarePlan.name, schema: SelfCarePlanSchema },
    ]),
  ],
  controllers: [SelfCarePlanController],
  providers: [SelfCarePlanService],
})
export class SelfCarePlanModule {}

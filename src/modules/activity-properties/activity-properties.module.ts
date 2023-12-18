import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ActivityProperties,
  ActivityPropertiesSchema,
} from "./schemas/activity-properties.schema";
import { ActivityPropertiesController } from "./activity-properties.controller";
import { ActivityPropertiesService } from "./activity-properties.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityProperties.name, schema: ActivityPropertiesSchema },
    ]),
  ],
  controllers: [ActivityPropertiesController],
  providers: [ActivityPropertiesService],
})
export class ActivityPropertiesModule {}

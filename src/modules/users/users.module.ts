import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CatsController } from "./users.controller";
import { CatsService } from "./users.service";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

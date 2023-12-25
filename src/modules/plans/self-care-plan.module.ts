import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SelfCarePlanController } from "./self-care-plan.controller";
import { SelfCarePlanService } from "./self-care-plan.service";
import {
  SelfCarePlan,
  SelfCarePlanSchema,
} from "./schemas/self-care-plan.schema";
import { UsersService } from "../users/users.service";
import { User, UserSchema } from "../users/schemas/user.schema";
import {
  IssuedToken,
  IssuedTokenSchema,
} from "../tokens/schemas/issued-tokens.schema";
import { IssuedTokensService } from "../tokens/issued-tokens.service";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SelfCarePlan.name, schema: SelfCarePlanSchema },
      { name: User.name, schema: UserSchema },
      { name: IssuedToken.name, schema: IssuedTokenSchema },
    ]),
  ],
  controllers: [SelfCarePlanController],
  providers: [
    AuthService,
    IssuedTokensService,
    UsersService,
    JwtService,
    SelfCarePlanService,
  ],
})
export class SelfCarePlanModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IssuedTokensService } from "./issued-tokens.service";
import { IssuedToken, IssuedTokenSchema } from "./schemas/issued-tokens.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IssuedToken.name, schema: IssuedTokenSchema },
    ]),
  ],
  providers: [IssuedTokensService],
  exports: [IssuedTokensService],
})
export class IssuedTokensModule {}

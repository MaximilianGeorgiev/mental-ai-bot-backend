import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { AdminStrategy } from "./admin.strategy";
import { JwtService } from "@nestjs/jwt";
import { IssuedTokensModule } from "../tokens/issued-tokens.module";
import { IssuedTokensService } from "../tokens/issued-tokens.service";
//import { IssuedTokensService } from "../tokens/issued-tokens.service";

@Module({
  imports: [UsersModule, PassportModule, JwtService, IssuedTokensModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    IssuedTokensService,
  ],
})
export class AuthModule {}

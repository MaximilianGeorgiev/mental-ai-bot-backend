import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./modules/auth/auth.service";
import { LocalStrategy } from "./modules/auth/local.strategy";
import { UsersService } from "./modules/users/users.service";
import { User, UserSchema } from "./modules/users/schemas/user.schema";
import { LocalAuthGuard } from "./modules/auth/local-auth.guard";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot("mongodb://localhost:27017/mental-ai"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: "ah23refdcvxvfr4444eeptb0l21izz15qb4y",
      signOptions: { expiresIn: "60s" },
    }),
    UsersModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    UsersService,
    LocalAuthGuard,
  ],
})
export class AppModule {}

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
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./modules/auth/jwt.strategy";
import { AdminStrategy } from "./modules/auth/admin.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot("mongodb://localhost:27017/mental-ai"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: "ah23refdcvxvfr4444eeptb0l21izz15qb4y",
      signOptions: { expiresIn: "1080s" },
    }),
    UsersModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    UsersService,
  ],
})
export class AppModule {}

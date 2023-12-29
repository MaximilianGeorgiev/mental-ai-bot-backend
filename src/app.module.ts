import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
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
import { IssuedTokensModule } from "./modules/tokens/issued-tokens.module";
import { EntityOwnerStrategy } from "./modules/auth/entity-owner.strategy";
import { ConversationsModule } from "./modules/conversations/conversation.module";
import { ConversationService } from "./modules/conversations/conversation.service";
import { SelfCarePlanModule } from "./modules/plans/self-care-plan.module";
import { SelfCarePlanService } from "./modules/plans/self-care-plan.service";
import {
  Conversation,
  ConversationSchema,
} from "./modules/conversations/schemas/conversation.schema";
import {
  SelfCarePlan,
  SelfCarePlanSchema,
} from "./modules/plans/schemas/self-care-plan.schema";
import { CorsMiddleware } from "./middlewares/cors.middleware";
import {
  ActivityProperties,
  ActivityPropertiesSchema,
} from "./modules/activity-properties/schemas/activity-properties.schema";
import { ActivityPropertiesModule } from "./modules/activity-properties/activity-properties.module";
import { ActivityPropertiesService } from "./modules/activity-properties/activity-properties.service";
import { EntityOwnerMiddleware } from "./middlewares/entity-owner.middleware";
import { isUserAuthenticatedMiddleware } from "./middlewares/is-authenticated.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot("mongodb://localhost:27017/mental-ai"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    MongooseModule.forFeature([
      { name: SelfCarePlan.name, schema: SelfCarePlanSchema },
    ]),
    MongooseModule.forFeature([
      { name: ActivityProperties.name, schema: ActivityPropertiesSchema },
    ]),
    JwtModule.register({
      secret: "ah23refdcvxvfr4444eeptb0l21izz15qb4y",
      signOptions: { expiresIn: "1080s" },
    }),
    UsersModule,
    PassportModule,
    IssuedTokensModule,
    ConversationsModule,
    SelfCarePlanModule,
    ActivityPropertiesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    EntityOwnerStrategy,
    UsersService,
    ConversationService,
    SelfCarePlanService,
    ActivityPropertiesService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes("*"); // Allow CORS for all routes
    consumer
      .apply(EntityOwnerMiddleware)
      .forRoutes(
        { path: "/plans/*", method: RequestMethod.GET },
        { path: "/plans/*", method: RequestMethod.PUT },
        { path: "/plans/*", method: RequestMethod.DELETE },
      );
    consumer
      .apply(isUserAuthenticatedMiddleware)
      .forRoutes({ path: "/authenticated", method: RequestMethod.POST });
  }
}

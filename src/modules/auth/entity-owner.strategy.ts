/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "src/types/interfaces/entities/users";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { MessageService } from "../messages/message.service";
import { ConversationService } from "../conversations/conversation.service";
import { SelfCarePlanService } from "../plans/self-care-plan.service";
import { ServiceNames } from "src/types/enums/service-calls.enum";
import { IssuedTokensService } from "../tokens/issued-tokens.service";

// This strategy is always chained and examines if the queried entity belongs to the user
@Injectable()
export class EntityOwnerStrategy extends PassportStrategy(
  Strategy,
  "entityOwner",
) {
  queryParam: string;
  routeUrl: string;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private messagesService: MessageService,
    private conversationsService: ConversationService,
    private plansService: SelfCarePlanService,
    private tokensService: IssuedTokensService,
  ) {
    super();
  }

  // Built in function to determine if access to the route should be granted or not
  // If result is true then the "validate" method of this strategy is called. We have the ID
  // extracted from the query param and we will be able to determine if the requester is the owner
  // of the entity.
  canActivate(context: ExecutionContext) {
    const {
      params: { id: queriedId },
      url,
    } = context.switchToHttp().getRequest();

    if (queriedId) {
      this.queryParam = queriedId;
      this.routeUrl = url;

      return true;
    }

    return false;
  }

  async validate(
    username: string,
    _password: string,
  ): Promise<Partial<User> | null> {
    const userFound = await this.usersService.find("username", username, false);

    if (userFound) {
      const { _id: userId } = userFound as unknown as User;

      /* From the URL extract the sub route that is queried
         So we can call the respective service, fetch the correct entity
         and compare the ID of the authenticated user and the userId in the fetched entity
         to determine ownership and hence authorize this API call. */
      const serviceName = this.authService.getServiceCall(
        this.queryParam,
        this.routeUrl,
      ) as keyof typeof ServiceNames;

      if (!this[ServiceNames[serviceName]]) {
        throw new UnauthorizedException();
      }

      const service = this[ServiceNames[serviceName]];
      const { userId: entityOwnerUserId, _id: entityId } = (await service.find(
        "_id",
        this.queryParam,
        false,
      )) as unknown as any;

      if (entityOwnerUserId !== userId || entityId !== userId) {
        throw new UnauthorizedException(); // user is not owner of requested entity
      }
    } else {
      throw new UnauthorizedException();
    }

    // This return value is trivial. Passport uses it internally and attaches "user" property to the Request() decorator
    // in the controller.
    const { password, ...result } = userFound as unknown as User;
    return result;
  }
}

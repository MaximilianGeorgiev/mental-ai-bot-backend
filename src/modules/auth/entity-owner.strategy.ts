/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/types/interfaces/entities/users";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { MessageService } from "../messages/message.service";
import { ConversationService } from "../conversations/conversation.service";
import { SelfCarePlanService } from "../plans/self-care-plan.service";
import { ServiceNames } from "src/types/enums/service-calls.enum";
import { IssuedTokensService } from "../tokens/issued-tokens.service";
import { IssuedToken } from "../tokens/schemas/issued-tokens.schema";
import { CrudService } from "src/types/interfaces/api";
import { toObjectId } from "src/utils/database";

// This strategy is always chained and examines if the queried entity belongs to the user
@Injectable()
export class EntityOwnerStrategy extends PassportStrategy(
  Strategy,
  "entityOwner",
) {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private conversationsService: ConversationService,
    private plansService: SelfCarePlanService,
    private tokensService: IssuedTokensService,
  ) {
    super({ passReqToCallback: true }); // obtain request headers in validate method
  }

  async validate(request: Request): Promise<Partial<User> | null> {
    //@ts-ignore
    const bearerToken = request.headers.authorization.split(" ")[1];
    //@ts-ignore
    const queryParam = request.param(
      request.method === "PUT" || request.method === "DELETE"
        ? "_id"
        : request.method === "GET"
        ? "searchValue"
        : "",
    );
    //@ts-ignore
    const column = request.param("column");
    const routeUrl = request.url;

    // Obtain who owns the issued token
    const { token, username } = (await this.tokensService.find(
      "token",
      bearerToken,
      false,
    )) as unknown as IssuedToken;

    if (!token || !username) {
      throw new UnauthorizedException();
    }

    const userFound = await this.usersService.find("username", username, false);

    if (userFound) {
      const { _id: userId } = userFound as unknown as User;

      /* From the URL extract the sub route that is queried
         So we can call the respective service, fetch the correct entity
         and compare the ID of the authenticated user and the userId in the fetched entity
         to determine ownership and hence authorize this API call. */
      const serviceName = this.authService.getServiceCall(
        queryParam,
        routeUrl,
      ) as keyof typeof ServiceNames;

      if (!this[serviceName as keyof typeof this]) {
        throw new UnauthorizedException();
      }

      const service = this[serviceName as keyof typeof this] as CrudService;
      const { userId: entityOwnerUserId, _id: entityId } = (await service.find(
        column,
        column === "_id" ? toObjectId(queryParam) : queryParam,
        false,
      )) as unknown as any;

      if (
        entityOwnerUserId?.toString() !== userId?.toString() &&
        entityId?.toString() !== userId?.toString()
      ) {
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

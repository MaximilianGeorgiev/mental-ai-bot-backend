/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { IssuedToken } from "src/modules/tokens/schemas/issued-tokens.schema";
import { User } from "src/modules/users/schemas/user.schema";
import { ServiceNames } from "src/types/enums/service-calls.enum";
import { CrudService } from "src/types/interfaces/api";
import { isValidObjectId, toObjectId } from "src/utils/database";
import { AuthService } from "src/modules/auth/auth.service";
import { UsersService } from "src/modules/users/users.service";
import { IssuedTokensService } from "src/modules/tokens/issued-tokens.service";
import { SelfCarePlanService } from "src/modules/plans/self-care-plan.service";

@Injectable()
export class EntityOwnerMiddleware implements NestMiddleware {
  usersService: UsersService;
  tokensService: IssuedTokensService;
  authService: AuthService;
  plansService: SelfCarePlanService;

  constructor(
    usersService: UsersService,
    tokensService: IssuedTokensService,
    authService: AuthService,
    plansService: SelfCarePlanService,
  ) {
    this.usersService = usersService;
    this.tokensService = tokensService;
    this.authService = authService;
    this.plansService = plansService;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const bearerToken = req.headers.authorization.split(" ")[1];
    const queryParam = req.params["0"];
    const column = "_id";
    const routeUrl = req.url;

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
        column === "_id"
          ? isValidObjectId(queryParam)
            ? toObjectId(queryParam)
            : queryParam
          : queryParam,
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

    // Call the next middleware in the chain
    next();
  }
}

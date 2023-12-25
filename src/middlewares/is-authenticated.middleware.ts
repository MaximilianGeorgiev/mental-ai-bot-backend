/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { IssuedTokensService } from "src/modules/tokens/issued-tokens.service";
import { UsersService } from "src/modules/users/users.service";
import { IssuedToken } from "src/types/interfaces/entities/issued-tokens";
import { User } from "src/types/interfaces/entities/users";
import { Request, Response } from "express";

@Injectable()
export class isUserAuthenticatedMiddleware implements NestMiddleware {
  tokensService: IssuedTokensService;
  usersService: UsersService;

  constructor(tokensService: IssuedTokensService, usersService: UsersService) {
    this.tokensService = tokensService;
    this.usersService = usersService;
  }

  async use(req: Request, res: Response) {
    //@ts-ignore
    const bearerToken = req.headers.authorization.split(" ")[1];
    //@ts-ignore
    const userId = req.body["id"];

    if (!bearerToken || !userId) {
      throw new UnauthorizedException();
    }

    const { username } = (await this.tokensService.find(
      "token",
      bearerToken,
      false,
    )) as unknown as IssuedToken;

    const userFound = await this.usersService.find("username", username, false);

    if (userFound) {
      const { _id: userIdFound } = userFound as unknown as User;

      if (userId === userIdFound) {
        return res.status(HttpStatus.OK).end();
      }
    }

    throw new UnauthorizedException();
  }
}

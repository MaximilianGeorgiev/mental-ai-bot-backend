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
import { UserRoles } from "src/types/enums/user-properties.enum";
import { IssuedTokensService } from "../tokens/issued-tokens.service";
import { ExtractJwt } from "passport-jwt";
import { IssuedToken } from "src/types/interfaces/entities/issued-tokens";

// This strategy is always chained and rejects access to admin routes
@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
  constructor(
    private userService: UsersService,
    private issuedTokensService: IssuedTokensService,
  ) {
    super({ passReqToCallback: true }); // obtain request headers in validate method
  }

  async validate(request: Request): Promise<Partial<User> | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const bearerToken = request.headers.authorization.split(" ")[1];

    // Obtain who owns the issued token
    const { token, username } = (await this.issuedTokensService.find(
      "token",
      bearerToken,
      false,
    )) as unknown as IssuedToken;

    if (!token || !username) {
      throw new UnauthorizedException();
    }

    const userFound = await this.userService.find("username", username, false);

    if (userFound) {
      const { role } = userFound as unknown as User;

      if (role.toString() !== UserRoles.ADMIN) {
        throw new UnauthorizedException();
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "src/types/interfaces/entities/users";
import { UsersService } from "../users/users.service";
import { UserRoles } from "src/types/enums/user-properties.enum";

// This strategy is always chained and rejects access to admin routes
@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super();
  }

  async validate(
    username: string,
    _password: string,
  ): Promise<Partial<User> | null> {
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

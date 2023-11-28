/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/types/interfaces/entities/users";
import { UsersService } from "../users/users.service";
import { UserRoles } from "src/types/enums/user-properties.enum";

// This strategy is always chained and examines if the queried entity belongs to the user
@Injectable()
export class EntityOwnerStrategy extends PassportStrategy(
  Strategy,
  "entityOwner",
) {
  queryParam: string;

  constructor(private userService: UsersService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const id = params.id; // automatically parsed

    if (id) {
      this.queryParam = id;
    }
  }

  async validate(
    username: string,
    _password: string,
  ): Promise<Partial<User> | null> {
    const userFound = await this.userService.find("username", username, false);

    if (userFound) {
      const { _id: userId } = userFound as unknown as User;
    } else {
      throw new UnauthorizedException();
    }

    // This return value is trivial. Passport uses it internally and attaches "user" property to the Request() decorator
    // in the controller.
    const { password, ...result } = userFound as unknown as User;
    return result;
  }
}

import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "src/types/interfaces/entities/users";

// Local in refered in Passport as storing credentials in app server, not local env
// Used for initial login primarily
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    // This return value is trivial. Passport uses it internally and attaches "user" property to the Request() decorator
    // in the controller.
    return user;
  }
}

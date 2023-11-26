import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { PassportUserObject } from "src/types/interfaces/auth/login";

// Strategy to handle JWT when requesting protected routes
// Used by a guard
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Look for bearer header
      ignoreExpiration: false,
      secretOrKey: "ah23refdcvxvfr4444eeptb0l21izz15qb4y",
    });
  }

  async validate(payload: PassportUserObject) {
    // This return value is trivial. Passport uses it internally and attaches "user" property to the Request() decorator
    // in the controller.
    return { userId: payload.sub, username: payload.username };
  }
}

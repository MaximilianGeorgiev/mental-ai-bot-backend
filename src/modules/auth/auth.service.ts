import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User } from "src/types/interfaces/entities/users";
import { compare as bcryptPasswordCheck } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { LoginCredentialsPayload } from "src/types/interfaces/auth/login";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    usernameInput: string,
    passwordInput: string,
  ): Promise<Partial<User> | null> {
    const user = (await this.usersService.find(
      "username",
      usernameInput,
      false,
    )) as unknown as User;

    if (user) {
      const correctPassword = await bcryptPasswordCheck(
        passwordInput,
        user.password,
      );

      if (correctPassword) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: LoginCredentialsPayload) {
    const payload = { username: user.username, sub: user.password };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import { Controller, Get, UseGuards, Request, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthService } from "./modules/auth/auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginCredentialsPayload } from "./types/interfaces/auth/login";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard("local"))
  @Post("auth/login")
  async login(@Body() req: LoginCredentialsPayload) {
    return this.authService.login({
      username: req.username,
      password: req.password,
    }); // return auth token
  }
}

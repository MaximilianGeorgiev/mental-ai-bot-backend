import { Body, Controller, Get, HttpException, Post } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./schemas/user.schema";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): string {
    return "This action returns all cats";
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void | User> {
    const response = await this.usersService.create(createUserDto);

    if (response instanceof User) return response;
    else if (response instanceof HttpException) throw response;
  }
}

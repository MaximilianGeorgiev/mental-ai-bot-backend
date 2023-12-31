import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./schemas/user.schema";
import {
  isResponseInstanceOfUser,
  isServiceOutcome,
} from "src/types/guards/database-responses";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Get("/:column/:searchValue")
  async findByProperty(
    @Param("column") column: string,
    @Param("searchValue") searchValue: string,
    @Query("many") findMany: boolean,
  ): Promise<void | User[] | []> {
    const response = await this.usersService.find(
      column,
      searchValue,
      findMany,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfUser(response)) return response as User[];
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("admin"))
  @Get()
  async findAll(): Promise<void | User[]> {
    const response = await this.usersService.findAll();

    if (response === null) return [];
    else if (isResponseInstanceOfUser(response)) return response;
    else if (response instanceof HttpException) throw response;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void | User> {
    const response = await this.usersService.create(createUserDto);

    if (isResponseInstanceOfUser(response)) return response as User;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Put(":id")
  async update(
    @Body("column") column: string,
    @Body("updateValue") updateValue: string,
    @Param("id") userId: string,
  ): Promise<void | User | []> {
    if (!column || !updateValue || !userId)
      throw new HttpException(
        "Invalid parameters to process update operation.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const response = await this.usersService.update(
      userId,
      column,
      updateValue,
    );

    if (response === null) return [];
    else if (isResponseInstanceOfUser(response)) return response as User;
    else if (response instanceof HttpException) throw response;
  }

  @UseGuards(AuthGuard("jwt"), AuthGuard("entityOwner"))
  @Delete(":id")
  async delete(@Param("id") userId: string): Promise<string | void> {
    const response = await this.usersService.delete(userId);

    if (isServiceOutcome(response)) return response.message;
    else if (response instanceof HttpException) throw response;
  }
}

import { HttpException } from "@nestjs/common";
import { CreateConversationDto } from "src/modules/conversations/dtos/create-conversation.dto";
import { CreateMessageDto } from "src/modules/messages/dtos/create-message.dto";
import { CreateSelfCarePlanDto } from "src/modules/plans/dtos/create-self-care-plan.dto";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { ServiceOperationOutcome } from "./api-response";

export interface CrudService {
  find: <T>(
    databaseColumn: string,
    columnValue: string,
    findMany: boolean,
  ) => Promise<T | T[] | null>;

  findAll: <T>() => Promise<T[]>;

  create: <T>(dto: Dto) => Promise<T | HttpException>;

  update: <T>(
    id: string,
    databaseColumn: string,
    columnValue: string,
  ) => Promise<T | HttpException | null>;

  delete: (id: string) => Promise<HttpException | ServiceOperationOutcome>;
}

export type Dto =
  | CreateUserDto
  | CreateMessageDto
  | CreateConversationDto
  | CreateMessageDto
  | CreateSelfCarePlanDto;

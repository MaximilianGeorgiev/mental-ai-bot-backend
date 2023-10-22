import { Gender, Activity, Goal } from "src/types/user-properties.type";

export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly gender: Gender;
  readonly country?: string;
  readonly city?: string;
  readonly goals: Goal[];
  readonly preferedActivities?: Activity[];
  readonly age?: number;
}

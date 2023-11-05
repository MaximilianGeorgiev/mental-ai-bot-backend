import { Gender, Activity, Goal } from "src/types/user-properties.type";

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  gender: Gender;
  country?: string;
  city?: string;
  goals: Goal[];
  preferedActivities?: Activity[];
  age?: number;
}

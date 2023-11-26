import { Activity, Gender, Goal, Role } from "src/types/user-properties.type";

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  gender: Gender;
  country?: string;
  city?: string;
  preferedActivities?: Activity[];
  goals: Goal[];
  age?: number;
  role: Role;
}

import { Activities, Genders, Goals } from "./enums/user-properties.enum";

export type Gender = keyof typeof Genders;
export type Activity = keyof typeof Activities;
export type Goal = keyof typeof Goals;

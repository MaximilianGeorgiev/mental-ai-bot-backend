import { DailyTask } from "src/types/interfaces/entities/plans";

export interface CreateSelfCarePlanDto {
  _id: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  targetDate: Date;
  dailyTasks: DailyTask[];
  userId?: string; // bind foreign key
}

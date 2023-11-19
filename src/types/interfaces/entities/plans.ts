import { Activity } from "src/types/user-properties.type";

export interface DailyTask {
  activity: Activity;
  description: string;
  percentCompleted: number; // update everytime the user submits they worked towards their task
  dateUpdated: Date; // keep track of date updated to send reminders in case the user did not update today
}

export interface SelfCarePlan {
  _id: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  targetDate: Date;
  dailyTasks: DailyTask[];
  userId?: string; // bind foreign key
}

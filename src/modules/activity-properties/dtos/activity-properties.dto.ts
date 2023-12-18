import { Activity, ActivityMetric } from "src/types/user-properties.type";

export interface CreateActivityPropertyDto {
  activityName: Activity;
  benefits: string; // description of the benefits of said activity
  metric: ActivityMetric; // how is progress measured (miles, minutes, pages)
  metricQuantity: number;
  resources: string[]; // recommended books, music links etc.
}

import { ServiceNames } from "../enums/service-calls.enum";

export interface ServiceCall {
  foundService: boolean;
  serviceName: keyof typeof ServiceNames;
  parameterValue: string;
}

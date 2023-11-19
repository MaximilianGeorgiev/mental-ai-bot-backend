import { SelfCarePlan } from "src/modules/plans/schemas/self-care-plan.schema";
import { Message } from "./interfaces/entities/messages";
import { User } from "./interfaces/entities/users";

export type ResponseEntity = User | Message | SelfCarePlan;

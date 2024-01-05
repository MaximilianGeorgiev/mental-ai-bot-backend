import {
  AiTrainingAnswer,
  AiTrainingUterancesAndIntents,
} from "src/types/interfaces/ai";
import { depressionUtterancesAndIntents } from "./depression/utterances";
import { depressionAnswers } from "./depression/answers";
import { emotionsUtterrancesAndIntents } from "./emotions/utterances";
import { EmotionsAnswers } from "./emotions/answers";

export const utterancesAndIntents: AiTrainingUterancesAndIntents[] = [
  ...depressionUtterancesAndIntents,
  ...emotionsUtterrancesAndIntents,
];

export const answers: AiTrainingAnswer[] = [
  ...depressionAnswers,
  ...EmotionsAnswers,
];

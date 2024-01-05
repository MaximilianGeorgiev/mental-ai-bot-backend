import {
  AiTrainingAnswer,
  AiTrainingUterancesAndIntents,
} from "src/types/interfaces/ai";
import { depressionUtterancesAndIntents } from "./depression/utterances";
import { depressionAnswers } from "./depression/answers";

export const utterancesAndIntents: AiTrainingUterancesAndIntents[] = [
  ...depressionUtterancesAndIntents,
];

export const answers: AiTrainingAnswer[] = [...depressionAnswers];

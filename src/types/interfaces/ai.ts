export interface AiTrainingUterancesAndIntents {
  language: string;
  utterance: string;
  trainedAnswer: string; // uses "identifier" property from AiTrainingAnswer
}

export interface AiTrainingAnswer {
  language: string;
  identifier: string;
  message: string;
}

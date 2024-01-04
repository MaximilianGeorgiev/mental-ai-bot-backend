import {
  AiTrainingAnswer,
  AiTrainingUterancesAndIntents,
} from "src/types/interfaces/ai";

export const utterancesAndIntents: AiTrainingUterancesAndIntents[] = [
  {
    language: "en",
    utterance: "goodbye for now",
    trainedAnswer: "greeting.bye",
  },
  {
    language: "en",
    utterance: "bye bye take care",
    trainedAnswer: "greeting.bye",
  },
  {
    language: "en",
    utterance: "okay see you later",
    trainedAnswer: "greeting.bye",
  },
  {
    language: "en",
    utterance: "bye for now",
    trainedAnswer: "greeting.bye",
  },
  {
    language: "en",
    utterance: "i must go",
    trainedAnswer: "greeting.bye",
  },
  {
    language: "en",
    utterance: "hello",
    trainedAnswer: "greeting.hello",
  },
  {
    language: "en",
    utterance: "hi",
    trainedAnswer: "greeting.hello",
  },
  {
    language: "en",
    utterance: "howdy",
    trainedAnswer: "greeting.hello",
  },
];

export const answers: AiTrainingAnswer[] = [
  {
    language: "en",
    identifier: "greeting.bye",
    message: "Till next time",
  },
  {
    language: "en",
    identifier: "greeting.bye",
    message: "see you soon!",
  },
  {
    language: "en",
    identifier: "greeting.hello",
    message: "Hey there!",
  },
  {
    language: "en",
    identifier: "greetings.hello",
    message: "Greetings!",
  },
];

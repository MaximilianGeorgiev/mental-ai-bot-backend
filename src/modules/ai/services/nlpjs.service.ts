/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { AiImplementation } from "./main.service";
import { Message } from "src/types/interfaces/entities/messages";
import {
  answers,
  utterancesAndIntents,
} from "src/utils/ai-training/ai-training";
import {
  AiTrainingAnswer,
  AiTrainingUterancesAndIntents,
} from "src/types/interfaces/ai";
const { containerBootstrap } = require("@nlpjs/core");
const { Nlp } = require("@nlpjs/nlp");
const { LangEn } = require("@nlpjs/lang-en-min");

// This service is an implementation using the Nlp.js library
@Injectable()
export class NlpJsService implements AiImplementation {
  nlpObject: any = {}; // natural language processor

  constructor() {
    this.initProcessor();
  }

  async initProcessor() {
    const container = await containerBootstrap();
    container.use(Nlp);
    container.use(LangEn);

    this.nlpObject = container.get("nlp");
    this.nlpObject.settings.autoSave = false;
    this.nlpObject.addLanguage("en");

    // Adds the utterances and intents for the nlp
    utterancesAndIntents.forEach(
      (currentElement: AiTrainingUterancesAndIntents) => {
        const { language, utterance, trainedAnswer } = currentElement;
        this.nlpObject.addDocument(language, utterance, trainedAnswer);
      },
    );

    // Train answers
    answers.forEach((trainedAnswer: AiTrainingAnswer) => {
      const { language, identifier, message } = trainedAnswer;
      this.nlpObject.addAnswer(language, identifier, message);
    });

    await this.nlpObject.train();
    const response = await this.nlpObject.process("en", "I am very depresssed");
    console.log(response);
  }

  generateResponse(message: string): Message {
    return this.nlpObject.proccess("en", message);
  }
}

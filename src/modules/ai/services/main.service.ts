/* eslint-disable @typescript-eslint/no-var-requires */
/* This is the abstract service that will delegate the call to the respective 
service depending on implementation demand. A service which uses this.this.nlpObject is currently implemented.
Other itegrations such as rule based logic, chatgpt etc. are possible as long as a new service is written for it.
*/

import { Injectable } from "@nestjs/common";
const { containerBootstrap } = require("@nlpjs/core");
const { Nlp } = require("@nlpjs/nlp");
const { LangEn } = require("@nlpjs/lang-en-min");

@Injectable()
export class AiService {
  dock: any = {};
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
    this.nlpObject.addDocument("en", "goodbye for now", "greetings.bye");
    this.nlpObject.addDocument("en", "bye bye take care", "greetings.bye");
    this.nlpObject.addDocument("en", "okay see you later", "greetings.bye");
    this.nlpObject.addDocument("en", "bye for now", "greetings.bye");
    this.nlpObject.addDocument("en", "i must go", "greetings.bye");
    this.nlpObject.addDocument("en", "hello", "greetings.hello");
    this.nlpObject.addDocument("en", "hi", "greetings.hello");
    this.nlpObject.addDocument("en", "howdy", "greetings.hello");

    // Train also the NLG
    this.nlpObject.addAnswer("en", "greetings.bye", "Till next time");
    this.nlpObject.addAnswer("en", "greetings.bye", "see you soon!");
    this.nlpObject.addAnswer("en", "greetings.hello", "Hey there!");
    this.nlpObject.addAnswer("en", "greetings.hello", "Greetings!");

    await this.nlpObject.train();
    const response = await this.nlpObject.process("en", "I should go now");
    console.log(response);
  }
}

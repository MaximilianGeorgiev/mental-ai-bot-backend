/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { NlpJsService } from "./nlpjs.service";
import { Message } from "src/types/interfaces/entities/messages";

export interface AiImplementation {
  generateResponse(message: string): Message;
}

/* This is the abstract service that will delegate the call to the respective 
service depending on implementation demand. A service which uses Nlp.js is currently implemented.
Other itegrations such as rule based logic, chatgpt etc. are possible as long as a new service is written for it.
*/
const SERVICE_IMPLEMENTATION = "NLP.JS"; // TO DO: Extract env
@Injectable()
export class AiService implements AiImplementation {
  implementationService: any = {};

  constructor() {
    if (SERVICE_IMPLEMENTATION === "NLP.JS") {
      this.implementationService = new NlpJsService();
    }
  }
  generateResponse(message: string): Message {
    return this.implementationService.generateResponse(message);
  }
}

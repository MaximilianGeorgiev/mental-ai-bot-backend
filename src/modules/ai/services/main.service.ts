/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { NlpJsService } from "./nlpjs.service";

export interface AiImplementation {
  generateResponse(message: string): Promise<string>;
}

/* This is the abstract service that will delegate the call to the respective 
service depending on implementation demand. A service which uses Nlp.js is currently implemented.
Other itegrations such as rule based logic, chatgpt etc. are possible as long as a new service is written for it.
*/
const SERVICE_IMPLEMENTATION = "NLP.JS"; // TO DO: Extract env
@Injectable()
export class AiService implements AiImplementation {
  implementationService: any = {};

  constructor() {}
  async generateResponse(message: string): Promise<string> {
    if (SERVICE_IMPLEMENTATION === "NLP.JS") {
      if (!(this.implementationService instanceof NlpJsService)) {
        this.implementationService = await NlpJsService.createInstance();
      }
    }

    return this.implementationService.generateResponse(message);
  }
}

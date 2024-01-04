import { Module } from "@nestjs/common";

import { AiService } from "./services/main.service";

@Module({
  providers: [AiService],
})
export class AiModule {}

import { HttpStatus } from "@nestjs/common";
import { ResponseEntity } from "../api-response.type";

export interface ApiResponse {
  status: HttpStatus;
  message: ResponseEntity;
}

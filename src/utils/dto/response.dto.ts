import { HttpStatus } from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';

export class ResponseSuccess implements IResponse {
  constructor(
    infoMessage: string,
    data?: any,
    statusCode?: number,
    notLog?: boolean,
  ) {
    this.success = true;
    this.message = infoMessage;
    this.response = data;
    this.statusCode = statusCode ? statusCode : HttpStatus.OK;
    if (!notLog) {
      try {
        const offuscateRequest = JSON.parse(JSON.stringify(data));
        if (offuscateRequest && offuscateRequest.token)
          offuscateRequest.token = '*******';
      } catch (error) {}
    }
  }
  message: string;
  response: unknown[];
  success: boolean;
  statusCode: number;
}

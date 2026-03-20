import { HttpException } from '@nestjs/common';
import { ErrorCodeDef } from '../enums/error-code.enum';

export class AppException extends HttpException {
  constructor(errorCode: ErrorCodeDef) {
    super({ message: errorCode.message, code: errorCode.status }, errorCode.status);
  }
}

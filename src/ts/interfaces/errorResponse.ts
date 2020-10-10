import { getReasonPhrase } from 'http-status-codes';
import { HttpStatusCodeLiteral } from 'tsoa';
import ErrorCodes from '../types/errorCodes';

class ErrorResponse extends Error {
  private status: HttpStatusCodeLiteral;

  public code: keyof typeof ErrorCodes;

  constructor(status: HttpStatusCodeLiteral, code: ErrorCodes, message?: string) {
    super();
    this.message = message || getReasonPhrase(status);
    this.status = status;
    this.code = ErrorCodes[code] as keyof typeof ErrorCodes;
  }

  public getStatus(): HttpStatusCodeLiteral {
    return this.status;
  }
}

export default ErrorResponse;

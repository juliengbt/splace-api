import { getReasonPhrase } from 'http-status-codes';
import { HttpStatusCodeLiteral } from 'tsoa';
import ErrorCodes from '../types/errorCodes';

class ErrorResponse extends Error {
  private status: HttpStatusCodeLiteral;

  public code: ErrorCodes;

  constructor(status: HttpStatusCodeLiteral, code: ErrorCodes, message?: string) {
    super();
    this.message = message || getReasonPhrase(status);
    this.status = status;
    this.code = code;
  }

  public getStatus(): HttpStatusCodeLiteral {
    return this.status;
  }
}

export default ErrorResponse;

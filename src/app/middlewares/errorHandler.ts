import {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express';
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';
import ErrorResponse from '../../ts/interfaces/errorResponse';
import ErrorCodes from '../../ts/types/errorCodes';
import logger from '../logger';

const errorHandler = () => (
  err: Error,
  _req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): ExResponse | void => {
  if (res.headersSent) return next();

  if (err instanceof ErrorResponse) {
    return res.status(err.getStatus()).json(err);
  }

  logger.error(err);

  if (err instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new ErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCodes.STATUS,
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      ),
    );
  }

  return next();
};

export default errorHandler;

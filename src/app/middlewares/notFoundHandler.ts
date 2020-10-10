import {
  Response,
  Request,
} from 'express';
import {
  StatusCodes,
} from 'http-status-codes';
import ErrorResponse from '../../ts/interfaces/errorResponse';
import ErrorCodes from '../../ts/types/errorCodes';

const notFoundHandler = () => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _res: Response,
): Response => {
  throw new ErrorResponse(StatusCodes.NOT_FOUND, ErrorCodes.STATUS);
};

export default notFoundHandler;

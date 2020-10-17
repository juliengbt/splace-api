import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import {
  Controller,
  Get,
  Response,
  Path,
  Query,
  Route,
  SuccessResponse,
} from 'tsoa';
import SportDAO from '../dao/SportDAO';
import { Sport } from '../models/sport';
import ErrorResponse from '../ts/interfaces/errorResponse';
import { Code } from '../ts/types/code';
import ErrorCodes from '../ts/types/errorCodes';

@Route('sport')
export class SportController extends Controller {
  @SuccessResponse(200, 'OK')
  @Get()
  public async getSports(@Query() category?: Code): Promise<Sport[]> {
    if (category) return SportDAO.all(category);
    return SportDAO.all();
  }

  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND))
  @Get('{code}')
  public async getSport(@Path() code: Code): Promise<Sport> {
    const res = await SportDAO.findByCode(code);

    if (!res) {
      const msg = `Sport with code : ${code} was not found`;
      throw new ErrorResponse(StatusCodes.NOT_FOUND, ErrorCodes.STATUS, msg);
    }

    return res;
  }
}

export default SportController;

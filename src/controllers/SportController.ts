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
import ErrorCodes from '../ts/types/errorCodes';

@Route('sport')
export class SportController extends Controller {
  @SuccessResponse(200, 'OK')
  @Get()
  public getSports(@Query() category?: string): Promise<Sport[]> {
    if (category) return SportDAO.all(category);
    return SportDAO.all();
  }

  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND))
  @Get('{code}')
  public async getSport(@Path() code: string): Promise<Sport> {
    const res = await SportDAO.findByCode(code);
    if (!res) {
      throw new ErrorResponse(StatusCodes.NOT_FOUND, ErrorCodes.STATUS);
    }

    return res;
  }
}

export default SportController;

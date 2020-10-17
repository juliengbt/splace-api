import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { performance } from 'perf_hooks';
import {
  Body,
  Controller, Get, Path, Post, Query, Response, Route, SuccessResponse,
} from 'tsoa';
import EquipmentDAO from '../dao/EquipmentDAO';
import EquipmentLevelDAO from '../dao/EquipmentLevelDAO';
import EquipmentNatureDAO from '../dao/EquipmentNatureDAO';
import EquipmentTypeDAO from '../dao/EquipmentTypeDAO';
import OwnerDAO from '../dao/OwnerDAO';
import SoilTypeDAO from '../dao/SoilTypeDAO';
import SportDAO from '../dao/SportDAO';
import { Equipment, IEquipment } from '../models/equipment';
import { EquipmentLevel } from '../models/equipment_level';
import { EquipmentNature } from '../models/equipment_nature';
import { EquipmentType } from '../models/equipment_type';
import { Owner } from '../models/owner';
import { SoilType } from '../models/soil_type';
import { Sport } from '../models/sport';
import ErrorResponse from '../ts/interfaces/errorResponse';
import ErrorCodes from '../ts/types/errorCodes';
import { UUID } from '../ts/types/uuid';

interface Filters {
  soil_types: SoilType[];
  owners: Owner[];
  equipment_types: EquipmentType[];
  equipment_natures: EquipmentNature[];
  equipment_levels: EquipmentLevel[];
  sports: Sport[];
}

@Route('equipment')
export class EquipmentController extends Controller {
  /**
   * @param equipment Filters for finding the equipment,
   * example -> Finding volley-ball equipment arround Lannion in an area of 20km^2.
   * Must have locker, lighting, shower, handi-access.
   * Where Equipment/Installation name like 'Collège'
   * and soil type is beton or synt. Distance is in meters
   * @example equipment {
   *  "name": "Collège",
   *  "locker": true,
   *  "lighting": true,
   *  "shower": true,
   *  "sports": [
   *    {
   *      "code" : "volley"
   *    }
   *  ],
   *  "latitude": 48.7333,
   *  "longitude": -3.4667,
   *  "gps_area": {
   *    "max_lat": 48.7922383,
   *    "max_lon": -3.3677790,
   *    "min_lat": 48.6718575,
   *    "min_lon": -3.5502904
   *  },
   *  "installation" : {
   *    "name" : "Collège",
   *    "disabled_access": true
   *  },
   *  "soil_type": [
   *    {
   *      "code": "beton"
   *    },
   *    {
   *      "code": "synt"
   *    }
   *  ],
   *  "distance": 10000
   * }
   */
  @SuccessResponse(200, 'OK')
  @Post()
  public async getEquipments(
    @Body() equipment: IEquipment,
      @Query() offset?: number,
  ): Promise<Equipment[]> {
    return EquipmentDAO.distanceEquipment(equipment, offset || 0);
  }

  @Get('filters')
  @SuccessResponse(200, 'OK')
  public async getFilters(): Promise<Filters> {
    return {
      soil_types: await SoilTypeDAO.all(),
      owners: await OwnerDAO.all(),
      equipment_levels: await EquipmentLevelDAO.all(),
      equipment_natures: await EquipmentNatureDAO.all(),
      equipment_types: await EquipmentTypeDAO.all(),
      sports: await SportDAO.all(),
    };
  }

  @Response<ErrorResponse>(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND))
  @Get('{id}')
  public async getEquipmentById(@Path() id: UUID): Promise<Equipment> {
    const res = await EquipmentDAO.findById(id);

    if (!res) {
      const msg = `Equipment with id : ${id} was not found`;
      throw new ErrorResponse(StatusCodes.NOT_FOUND, ErrorCodes.STATUS, msg);
    }

    return res;
  }

  public static measurePromise(fn: () => Promise<any>): Promise<number> {
    const start = performance.now();
    const onPromiseDone = () => performance.now() - start;
    return fn().then(onPromiseDone, onPromiseDone);
  }
}

export default EquipmentController;

import {
  Body,
  Controller, Post, Query, Route, SuccessResponse,
} from 'tsoa';
import EquipmentDAO from '../dao/EquipmentDAO';
import { Equipment, IEquipment } from '../models/equipment';

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
  public getEquipments(
    @Body() equipment: IEquipment,
      @Query() offset?: number,
  ): Promise<Equipment[]> {
    return EquipmentDAO.distanceEquipment(equipment, offset || 0);
  }
}

export default EquipmentController;

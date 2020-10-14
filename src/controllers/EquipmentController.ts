import {
  Body,
  Controller, Post, Query, Route, SuccessResponse,
} from 'tsoa';
import EquipmentDAO from '../dao/EquipmentDAO';
import { Equipment, IEquipment } from '../models/equipment';

@Route('equipment')
export class EquipmentController extends Controller {
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

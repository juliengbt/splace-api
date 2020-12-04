import {
  ClassSerializerInterceptor, Controller, Get, UseInterceptors
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import EquipmentType from 'src/entities/equipmentType.entity';
import EquipmentTypeService from 'src/services/equipmentType.service';

@ApiTags('EquipmentType')
@Controller('equipmentType')
export default class EquipmentTypeController {
  constructor(private readonly service: EquipmentTypeService) {}

  @ApiResponse({
    status: 200,
    description: 'EquipmentType list',
    type: EquipmentType,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getEquipmentTypes(): Promise<EquipmentType[]> {
    return this.service.findAll();
  }
}

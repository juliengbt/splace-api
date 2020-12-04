import {
  ClassSerializerInterceptor, Controller, Get, UseInterceptors
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import EquipmentLevel from 'src/entities/equipmentLevel.entity';
import EquipmentLevelService from 'src/services/equipmentLevel.service';

@ApiTags('EquipmentLevel')
@Controller('equipmentLevel')
export default class EquipmentLevelController {
  constructor(private readonly service: EquipmentLevelService) {}

  @ApiResponse({
    status: 200,
    description: 'EquipmentLevel list',
    type: EquipmentLevel,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getEquipmentLevels(): Promise<EquipmentLevel[]> {
    return this.service.findAll();
  }
}

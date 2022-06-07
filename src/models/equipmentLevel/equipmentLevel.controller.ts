import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentLevel from 'src/models/equipmentLevel/equipmentLevel.entity';
import EquipmentLevelService from 'src/models/equipmentLevel/equipmentLevel.service';

@ApiTags('EquipmentLevel')
@Controller('equipmentLevel')
export default class EquipmentLevelController {
  constructor(private readonly service: EquipmentLevelService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'EquipmentLevel list',
    type: EquipmentLevel,
    isArray: true
  })
  getEquipmentLevels(): Promise<EquipmentLevel[]> {
    return this.service.findAll();
  }
}

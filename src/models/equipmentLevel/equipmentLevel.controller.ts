import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentLevel from 'src/models/equipmentLevel/equipmentLevel.entity';
import EquipmentLevelService from 'src/models/equipmentLevel/equipmentLevel.service';

@ApiTags('EquipmentLevel')
@Controller('equipmentLevel')
export default class EquipmentLevelController {
  constructor(private readonly service: EquipmentLevelService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    status: 200,
    description: 'EquipmentLevel list',
    type: EquipmentLevel,
    isArray: true
  })
  getEquipmentLevels(): Promise<EquipmentLevel[]> {
    return this.service.findAll();
  }
}

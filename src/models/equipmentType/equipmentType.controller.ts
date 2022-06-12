import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentType from 'src/models/equipmentType/equipmentType.entity';
import EquipmentTypeService from 'src/models/equipmentType/equipmentType.service';

@ApiTags('EquipmentType')
@Controller('equipmentType')
export default class EquipmentTypeController {
  constructor(private readonly service: EquipmentTypeService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'EquipmentType list',
    type: EquipmentType,
    isArray: true
  })
  getEquipmentTypes(): Promise<EquipmentType[]> {
    return this.service.findAll();
  }
}

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentType from 'src/entities/equipmentType.entity';
import EquipmentTypeService from 'src/services/equipmentType.service';

@ApiTags('EquipmentType')
@Controller('equipmentType')
export default class EquipmentTypeController {
  constructor(private readonly service: EquipmentTypeService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'EquipmentType list',
    type: EquipmentType,
    isArray: true
  })
  getEquipmentTypes(): Promise<EquipmentType[]> {
    return this.service.findAll();
  }
}

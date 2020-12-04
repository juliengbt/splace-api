import {
  ClassSerializerInterceptor, Controller, Get, UseInterceptors
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import EquipmentNature from 'src/entities/equipmentNature.entity';
import EquipmentNatureService from 'src/services/equipmentNature.service';

@ApiTags('EquipmentNature')
@Controller('equipmentNature')
export default class EquipmentNatureController {
  constructor(private readonly service: EquipmentNatureService) {}

  @ApiResponse({
    status: 200,
    description: 'EquipmentNature list',
    type: EquipmentNature,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getEquipmentNatures(): Promise<EquipmentNature[]> {
    return this.service.findAll();
  }
}

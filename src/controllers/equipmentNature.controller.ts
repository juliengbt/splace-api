import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentNature from 'src/entities/equipmentNature.entity';
import EquipmentNatureService from 'src/services/equipmentNature.service';

@ApiTags('EquipmentNature')
@Controller('equipmentNature')
export default class EquipmentNatureController {
  constructor(private readonly service: EquipmentNatureService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'EquipmentNature list',
    type: EquipmentNature,
    isArray: true
  })
  getEquipmentNatures(): Promise<EquipmentNature[]> {
    return this.service.findAll();
  }
}

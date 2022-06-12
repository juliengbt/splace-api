import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentNature from 'src/models/equipmentNature/equipmentNature.entity';
import EquipmentNatureService from 'src/models/equipmentNature/equipmentNature.service';

@ApiTags('EquipmentNature')
@Controller('equipmentNature')
export default class EquipmentNatureController {
  constructor(private readonly service: EquipmentNatureService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'EquipmentNature list',
    type: EquipmentNature,
    isArray: true
  })
  getEquipmentNatures(): Promise<EquipmentNature[]> {
    return this.service.findAll();
  }
}

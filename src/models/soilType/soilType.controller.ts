import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import SoilType from 'src/models/soilType/soilType.entity';
import SoilTypeService from 'src/models/soilType/soilType.service';

@ApiTags('SoilType')
@Controller('soilType')
export default class SoilTypeController {
  constructor(private readonly service: SoilTypeService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'SoilType list',
    type: SoilType,
    isArray: true
  })
  getSoilTypes(): Promise<SoilType[]> {
    return this.service.findAll();
  }
}

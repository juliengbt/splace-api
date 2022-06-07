import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import SoilType from 'src/models/soilType/soilType.entity';
import SoilTypeService from 'src/models/soilType/soilType.service';

@ApiTags('SoilType')
@Controller('soilType')
export default class SoilTypeController {
  constructor(private readonly service: SoilTypeService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'SoilType list',
    type: SoilType,
    isArray: true
  })
  getSoilTypes(): Promise<SoilType[]> {
    return this.service.findAll();
  }
}

import {
  ClassSerializerInterceptor, Controller, Get, UseInterceptors
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import SoilType from 'src/entities/soilType.entity';
import SoilTypeService from 'src/services/soilType.service';

@ApiTags('SoilType')
@Controller('soilType')
export default class SoilTypeController {
  constructor(private readonly service: SoilTypeService) {}

  @ApiResponse({
    status: 200,
    description: 'SoilType list',
    type: SoilType,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getSoilTypes(): Promise<SoilType[]> {
    return this.service.findAll();
  }
}

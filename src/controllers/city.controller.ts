/* eslint-disable max-len */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  NotAcceptableException,
  Post,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import City from 'src/entities/city.entity';
import EquipmentDTO from 'src/dto/city.dto';
import EquipmentService from 'src/services/city.service';

@ApiTags('City')
@Controller('city')
export default class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @ApiResponse({
    status: 200,
    description: 'City list',
    type: City,
    isArray: true
  })
  @ApiNotAcceptableResponse({ description: 'City DTO is not valid.' })
  @ApiBody({ type: EquipmentDTO })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async getUsingDTO(@Body() cityDTO: EquipmentDTO): Promise<City[]> {
    const cityParam = cityDTO;

    if (cityDTO.ids) throw new NotAcceptableException('It is not allowed to use id property when using DTO');

    if (cityParam.name) cityParam.name = cityParam.name.flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
    cityParam.name = cityParam.name?.length ? cityParam.name : undefined;

    if (Object.keys(cityParam).length === 0 && cityParam.constructor === Object) throw new NotAcceptableException('cityDTO is empty');
    return this.service.findUsingDTO(cityParam);
  }
}

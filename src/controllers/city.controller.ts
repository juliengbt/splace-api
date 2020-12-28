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
import CityService from 'src/services/city.service';
import CitySearchDTO from 'src/dto/city.search.dto';
import CityDTO from 'src/dto/city.dto';

@ApiTags('City')
@Controller('city')
export default class CityController {
  constructor(private readonly service: CityService) {}

  @ApiResponse({
    status: 200,
    description: 'CitySearchDTO list',
    type: CitySearchDTO,
    isArray: true
  })
  @ApiNotAcceptableResponse({ description: 'City DTO is not valid.' })
  @ApiBody({ type: CityDTO })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async getUsingDTO(@Body() cityDTO: CityDTO): Promise<CitySearchDTO[]> {
    const cityParam = cityDTO;

    if (cityDTO.ids) throw new NotAcceptableException('It is not allowed to use id property when using DTO');

    if (cityParam.name) cityParam.name = cityParam.name.flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
    cityParam.name = cityParam.name?.length ? cityParam.name : undefined;

    if (cityParam.name) {
      const last = cityParam.name.pop();
      cityParam.name.push(`>${last}`, `${last}*`);
    }

    if (Object.keys(cityParam).length === 0 && cityParam.constructor === Object) throw new NotAcceptableException('cityDTO is empty');
    return this.service.findUsingDTO(cityParam);
  }
}

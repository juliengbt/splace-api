/* eslint-disable max-len */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import City from 'src/models/city/city.entity';
import CityService from 'src/models/city/city.service';
import CitySearch from 'src/models/city/dto/city.search';

@ApiTags('City')
@Controller('city')
export default class CityController {
  constructor(private readonly service: CityService) {}

  @Get(':id')
  @ApiOkResponse({
    description: 'City',
    type: City
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  @ApiParam({ required: true, type: String, name: 'id' })
  async getById(@Param('id') id: string): Promise<City> {
    const city = await this.service.findById(id);
    if (!city) throw new NotFoundException(undefined, `No cities found with id : ${id}`);
    return city;
  }

  @Post()
  @Public()
  @ApiOkResponse({
    description: 'City list',
    type: City,
    isArray: true
  })
  @ApiNotAcceptableResponse({ description: 'City DTO is not valid.' })
  @ApiBody({ type: CitySearch })
  @ApiNotAcceptableResponse()
  @HttpCode(HttpStatus.OK)
  async getUsingDTO(@Body() cityDTO: CitySearch): Promise<City[]> {
    const cityParam = cityDTO;

    if (cityDTO.ids)
      throw new NotAcceptableException(
        undefined,
        'Id is not allowed to use id property when using DTO'
      );

    if (cityParam.names) {
      const last = cityParam.names.pop();
      cityParam.names = cityParam.names.filter((str) => str.length > 1);
      if (cityParam.names[0]) cityParam.names[0] = `>${cityParam.names[0]}`; // First word is important
      cityParam.names.push(`>${last}*`); // Last word is important
    }

    if (Object.keys(cityDTO).length === 0 && cityDTO.constructor === Object)
      throw new NotAcceptableException(undefined, 'cityDTO is empty');
    return this.service.findUsingDTO(cityParam);
  }
}

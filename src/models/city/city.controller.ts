/* eslint-disable max-len */
import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import CityService from 'src/models/city/city.service';
import CitySearch from 'src/models/city/dto/city.dto';
import City from 'src/models/city/city.entity';
import { Public } from 'src/decorators/public';

@ApiTags('City')
@Controller('city')
export default class CityController {
  constructor(private readonly service: CityService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'City',
    type: City,
    isArray: false
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  @ApiParam({ required: true, type: String, name: 'id' })
  async getById(@Param('id', new ParseUUIDPipe()) id: Buffer): Promise<City> {
    const city = await this.service.findById(id);
    if (!city)
      throw new NotFoundException(
        undefined,
        `No cities found with id : ${id.toString('base64url')}`
      );
    return city;
  }

  @Post()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'City list',
    type: City,
    isArray: true
  })
  @ApiNotAcceptableResponse({ description: 'City DTO is not valid.' })
  @ApiBody({ type: CitySearch })
  @ApiNotAcceptableResponse()
  async getUsingDTO(@Body() cityDTO: CitySearch): Promise<City[]> {
    const cityParam = cityDTO;

    if (cityDTO.ids)
      throw new NotAcceptableException(
        undefined,
        'It is not allowed to use id property when using DTO'
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

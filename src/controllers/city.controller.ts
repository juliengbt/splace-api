/* eslint-disable max-len */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import CityService from 'src/services/city.service';
import CityDTO from 'src/dto/search/city.dto';
import City from 'src/entities/city.entity';

@ApiTags('City')
@Controller('city')
export default class CityController {
  constructor(private readonly service: CityService) {}

  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: City,
    isArray: false
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiParam({ required: true, type: String, name: 'id' })
  async getById(@Param('id', new ParseUUIDPipe()) id: Buffer): Promise<City> {
    const city = await this.service.findById(id);
    if (city === undefined)
      throw new NotFoundException(
        undefined,
        `No cities found with id : ${id.toString('base64url')}`
      );
    return city;
  }

  @ApiResponse({
    status: 200,
    description: 'City list',
    type: City,
    isArray: true
  })
  @ApiNotAcceptableResponse({ description: 'City DTO is not valid.' })
  @ApiBody({ type: CityDTO })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async getUsingDTO(@Body() cityDTO: CityDTO): Promise<City[]> {
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

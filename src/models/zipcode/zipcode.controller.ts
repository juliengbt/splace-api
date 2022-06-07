import { Controller, Post, Body, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiNotAcceptableResponse, ApiBody } from '@nestjs/swagger';
import CitySearch from 'src/models/city/dto/city.dto';
import Zipcode from 'src/models/zipcode/zipcode.entity';
import ZipcodeService from 'src/models/zipcode/zipcode.service';

@ApiTags('Zipcode')
@Controller('zipcode')
export default class ZipcodeController {
  constructor(private readonly service: ZipcodeService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Zipcode',
    type: Zipcode
  })
  @ApiNotAcceptableResponse({ description: 'City DTO is not valid.' })
  @ApiBody({ type: CitySearch })
  @ApiNotAcceptableResponse()
  async getOneUsingDTO(@Body() cityDTO: CitySearch): Promise<Zipcode> {
    const cityParam = cityDTO;

    if (cityDTO.ids)
      throw new NotAcceptableException('It is not allowed to use id property when using DTO');

    if (cityParam.names) {
      const last = cityParam.names.pop();
      cityParam.names = cityParam.names.filter((str) => str.length > 1);
      if (cityParam.names[0]) cityParam.names[0] = `>${cityParam.names[0]}`; // First word is important
      cityParam.names.push(`>${last}*`); // Last word is important
    }

    if (Object.keys(cityDTO).length === 0 && cityDTO.constructor === Object)
      throw new NotAcceptableException('cityDTO is empty');
    const res = await this.service.findOne(cityParam);
    if (!res) throw new NotFoundException();
    return res;
  }
}

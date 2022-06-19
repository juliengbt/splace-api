/* eslint-disable max-len */
import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Post,
  NotFoundException,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import Equipment from 'src/models/equipment/equipment.entity';
import EquipmentSearch from 'src/models/equipment/dto/equipment.search';
import EquipmentService from 'src/models/equipment/equipment.service';
import ParseBase64IDPipe from 'src/pipes/parse-base64id.pipe';
import { distanceEarthPoints, getArea } from 'src/utils/functions';
import { Public } from 'src/decorators/public';

@ApiTags('Equipment')
@Controller('equipment')
export default class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @Get(':id')
  @Public()
  @ApiOkResponse({
    description: 'Equipment list',
    type: Equipment,
    isArray: false
  })
  @ApiParam({ type: String, required: true, name: 'id' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  async getById(@Param('id', new ParseBase64IDPipe()) id: Buffer): Promise<Equipment> {
    const equipment = await this.service.findById(id);
    if (!equipment)
      throw new NotFoundException(`No equipment found with id : ${id.toString('base64url')}`);
    return equipment;
  }

  @Post()
  @Public()
  @ApiOkResponse({
    description: 'Equipment list',
    type: Equipment,
    isArray: true
  })
  @HttpCode(HttpStatus.OK)
  @ApiNotAcceptableResponse({ description: 'Equipment DTO is not valid.' })
  @ApiBody({ type: EquipmentSearch })
  @ApiQuery({ name: 'offset', required: false })
  @ApiNotAcceptableResponse()
  async getUsingDTO(
    @Body() equipmentDTO: EquipmentSearch,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number
  ): Promise<Equipment[]> {
    if (offset >= 100)
      throw new NotAcceptableException('Maximum number of object is limited to 100');

    const equipmentParam = equipmentDTO;
    const installationDTO = equipmentDTO.installation;

    if (equipmentParam.name) {
      equipmentParam.name = [...new Set(equipmentParam.name)]
        .flatMap((x) => x.split(' '))
        .filter((str) => str.length > 2);
    }

    if (installationDTO?.name) {
      installationDTO.name = [...new Set(installationDTO.name)]
        .flatMap((x) => x.split(' '))
        .filter((str) => str.length > 2);
    }

    if (installationDTO?.address?.city) {
      if (installationDTO?.address.city.zipcode)
        throw new NotAcceptableException('Zip code is not allowed here');
      if (installationDTO.address.city.ids) {
        installationDTO.address.city.ids = [...new Set(installationDTO.address.city.ids)];
      }
    }

    /* This is important because if latitude and longitude are set then server will calculate distance from equipments
       to user position. If the area is too large there will be a large amount of calculation, so in order to restrict this,
       we delete the user position  but the equipments won't be sorted */

    // Latitude && longitude are set
    if (equipmentParam.latitude && equipmentParam.longitude) {
      if (equipmentDTO.gps_area) {
        // Big area : surface > 200 km2
        if (
          distanceEarthPoints(
            equipmentDTO.gps_area.max_lat,
            equipmentDTO.gps_area.max_lon,
            equipmentDTO.gps_area.min_lat,
            equipmentDTO.gps_area.min_lon
          ) > 200 // 200km
        ) {
          delete equipmentParam.latitude;
          delete equipmentParam.longitude;
          // If user is searching by name in a small area then search within an area of 200km2
        } else if (equipmentParam.name && equipmentParam.name.length > 0) {
          equipmentDTO.gps_area = getArea(equipmentParam.latitude, equipmentParam.longitude, 100);
        }
      } else {
        // If user did not define an area
        equipmentDTO.gps_area = getArea(equipmentParam.latitude, equipmentParam.longitude, 100);
      }
    }

    if (installationDTO !== undefined) equipmentParam.installation = installationDTO;

    return this.service.findUsingDTO(equipmentParam, offset < 0 ? 0 : offset);
  }
}

/* eslint-disable max-len */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentSearch from 'src/models/equipment/dto/equipment.search';
import Equipment from 'src/models/equipment/entities/equipment.entity';
import EquipmentService from 'src/models/equipment/equipment.service';
import { distanceEarthPoints, getArea } from 'src/utils/functions';
import EquipmentLevel from './entities/level.entity';
import EquipmentNature from './entities/nature.entity';
import EquipmentOwner from './entities/owner.entity';
import EquipmentSurface from './entities/surface.entity';
import EquipmentType from './entities/type.entity';

@Controller('equipment')
export default class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @Get(':id')
  @Public()
  @ApiOkResponse({
    description: 'Equipment',
    type: Equipment,
    isArray: false
  })
  @ApiParam({ type: String, required: true, name: 'id' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  async getById(@Param('id') id: string): Promise<Equipment> {
    const equipment = await this.service.findById(id);
    if (!equipment) throw new NotFoundException(`No equipment found with id : ${id}`);
    return equipment;
  }

  @Post()
  @Public()
  @ApiOkResponse({ type: Equipment, isArray: true })
  @HttpCode(HttpStatus.OK)
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
    const sportingComplexDTO = equipmentDTO.sportingComplex;

    if (equipmentParam.name) {
      equipmentParam.name = [...new Set(equipmentParam.name)]
        .flatMap((x) => x.split(' '))
        .filter((str) => str.length > 2);
    }

    if (sportingComplexDTO?.name) {
      sportingComplexDTO.name = [...new Set(sportingComplexDTO.name)]
        .flatMap((x) => x.split(' '))
        .filter((str) => str.length > 2);
    }

    if (sportingComplexDTO?.address?.city) {
      if (sportingComplexDTO?.address.city.zipcode)
        throw new NotAcceptableException('Zip code is not allowed here');
      if (sportingComplexDTO.address.city.ids) {
        sportingComplexDTO.address.city.ids = [...new Set(sportingComplexDTO.address.city.ids)];
      }
    }

    /* This is important because if latitude and longitude are set then server will calculate distance from equipments
       to user position. If the area is too large there will be a large amount of calculation, so in order to restrict this,
       we delete the user position  but the equipments won't be sorted */

    // Latitude && longitude are set
    if (equipmentParam.latitude && equipmentParam.longitude) {
      if (equipmentDTO.gpsArea) {
        // Big area : surface > 200 km2
        if (
          distanceEarthPoints(
            equipmentDTO.gpsArea.maxLatitude,
            equipmentDTO.gpsArea.maxLongitude,
            equipmentDTO.gpsArea.minLatitude,
            equipmentDTO.gpsArea.minLongitude
          ) > 200 // 200km
        ) {
          equipmentDTO.gpsArea = getArea(equipmentParam.latitude, equipmentParam.longitude, 100);
          // If user is searching by name in a small area then search within an area of 200km2
        } else if (equipmentParam.name && equipmentParam.name.length > 0) {
          equipmentDTO.gpsArea = getArea(equipmentParam.latitude, equipmentParam.longitude, 100);
        }
      } else {
        // If user did not define an area
        equipmentDTO.gpsArea = getArea(equipmentParam.latitude, equipmentParam.longitude, 100);
      }
    }

    if (sportingComplexDTO !== undefined) equipmentParam.sportingComplex = sportingComplexDTO;

    return this.service.findUsingDTO(equipmentParam);
  }

  @Public()
  @Get('/owners')
  @ApiOkResponse({ type: EquipmentOwner, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getOwners(): Promise<EquipmentOwner[]> {
    return this.service.getOwners();
  }

  @Public()
  @Get('/types')
  @ApiOkResponse({ type: EquipmentType, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getTypes(): Promise<EquipmentType[]> {
    return this.service.getTypes();
  }

  @Public()
  @Get('/natures')
  @ApiOkResponse({ type: EquipmentNature, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getNatures(): Promise<EquipmentNature[]> {
    return this.service.getNatures();
  }

  @Public()
  @Get('/surfaces')
  @ApiOkResponse({ type: EquipmentSurface, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getSurfaces(): Promise<EquipmentSurface[]> {
    return this.service.getSurfaces();
  }

  @Public()
  @Get('/levels')
  @ApiOkResponse({ type: EquipmentLevel, isArray: true })
  @HttpCode(HttpStatus.OK)
  async getLevels(): Promise<EquipmentLevel[]> {
    return this.service.getLevels();
  }
}

/* eslint-disable max-len */
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query
} from '@nestjs/common';
import {
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
import { distanceEarthPointsGPSArea, getArea } from 'src/utils/functions';
import GPSAreaSearch from './dto/gpsArea.search';
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

  @Get()
  @Public()
  @ApiOkResponse({ type: Equipment, isArray: true })
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ type: EquipmentSearch })
  @ApiNotAcceptableResponse()
  async getUsingDTO(@Query() equipmentDTO: EquipmentSearch): Promise<Equipment[]> {
    const equipmentParam = equipmentDTO;
    const sportingComplexDTO = equipmentDTO.sportingComplex;
    let gpsArea: GPSAreaSearch | undefined;

    if (sportingComplexDTO?.address?.city?.ids) {
      sportingComplexDTO.address.city.ids = [...new Set(sportingComplexDTO.address.city.ids)];
    }

    if (
      equipmentParam.maxLatitude &&
      equipmentParam.maxLongitude &&
      equipmentParam.minLatitude &&
      equipmentParam.minLongitude
    ) {
      gpsArea = {
        maxLatitude: equipmentParam.maxLatitude,
        maxLongitude: equipmentParam.maxLongitude,
        minLatitude: equipmentParam.minLatitude,
        minLongitude: equipmentParam.minLongitude
      };
    }

    if (equipmentParam.name) {
      equipmentParam.name = [
        ...new Set(equipmentParam.name.flatMap((x) => x.split(' ')).filter((str) => str.length > 2))
      ];
    }

    if (equipmentParam.latitude && equipmentParam.longitude && !gpsArea) {
      gpsArea = getArea(equipmentParam.latitude, equipmentParam.longitude, 100);
    } else if (gpsArea && equipmentDTO.name?.length && distanceEarthPointsGPSArea(gpsArea) < 200) {
      gpsArea = getArea(
        (gpsArea.maxLatitude + gpsArea.minLatitude) / 2,
        (gpsArea.maxLongitude + gpsArea.minLongitude) / 2,
        100
      );
    }

    return this.service.findUsingDTO(equipmentParam, gpsArea);
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

/* eslint-disable max-len */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Post,
  UseInterceptors,
  NotFoundException,
  DefaultValuePipe,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import Equipment from 'src/entities/equipment.entity';
import EquipmentDTO from 'src/dto/equipment.dto';
import EquipmentService from 'src/services/equipment.service';
import { validate } from 'class-validator';

@ApiTags('Equipment')
@Controller('equipment')
export default class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: Equipment,
    isArray: false
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Equipment> {
    const equipment = await this.service.findById(id);
    if (equipment === undefined) throw new NotFoundException(`No equipment found with id : ${id}`);
    return equipment;
  }

  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: Equipment,
    isArray: true
  })
  @ApiNotAcceptableResponse({ description: 'Equipment DTO is not valid.' })
  @ApiBody({ type: EquipmentDTO })
  @ApiQuery({ name: 'offset', required: false })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async getUsingDTO(@Body() equipmentDTO: EquipmentDTO, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number): Promise<Equipment[]> {
    const equipmentParam = equipmentDTO;
    if (equipmentParam.name) {
      equipmentParam.name = [...new Set(equipmentParam.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
    }

    if (equipmentParam.installation?.name) {
      equipmentParam.installation.name = [...new Set(equipmentParam.installation.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
    }

    if (equipmentParam.installation?.city) {
      if (equipmentParam.installation.city.name) {
        equipmentParam.installation.city.name = [...new Set(equipmentParam.installation.city.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      }
      if (equipmentParam.installation?.city?.zip_code) throw new NotAcceptableException('Zip code is not allowed here');
      if (equipmentParam.installation.city.ids) {
        equipmentParam.installation.city.ids = [...new Set(equipmentParam.installation.city.ids)];
      }
    }
    await validate(equipmentParam).then((errors) => {
      if (errors.length > 0) {
        throw new NotAcceptableException(errors.map((err) => err.toString()));
      }
    });
    if (Object.keys(equipmentParam).length === 0 && equipmentParam.constructor === Object) throw new NotAcceptableException('equipmentDTO is empty');
    return this.service.findUsingDTO(equipmentParam, offset < 0 ? 0 : offset);
  }
}

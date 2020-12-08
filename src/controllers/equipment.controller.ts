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
import UUIDValidationPipe from 'src/validations/uuid.validation.pipe';

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
  async getById(@Param('id', new UUIDValidationPipe()) id: string): Promise<Equipment> {
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async getUsingDTO(@Body() equipmentDTO: EquipmentDTO, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number): Promise<Equipment[]> {
    const equipmentParam = equipmentDTO;
    equipmentParam.name = [...new Set(equipmentParam.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
    equipmentParam.name = equipmentParam.name?.length ? equipmentParam.name : undefined;

    if (equipmentParam.installation) {
      equipmentParam.installation.name = [...new Set(equipmentParam.installation.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      equipmentParam.installation.name = equipmentParam.installation.name?.length ? equipmentParam.installation.name : undefined;
    }

    if (Object.keys(equipmentParam).length === 0 && equipmentParam.constructor === Object) throw new NotAcceptableException('equipmentDTO is empty');
    return this.service.findUsingDTO(equipmentParam, offset < 0 ? 0 : offset);
  }
}

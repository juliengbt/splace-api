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
  ParseIntPipe,
  Patch,
  HttpCode
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import Equipment from 'src/entities/equipment.entity';
import EquipmentDTO from 'src/dto/search/equipment.dto';
import EquipmentService from 'src/services/equipment.service';
import { validate } from 'class-validator';
import ParseUUIDPipe from 'src/pipes/parse-uuid.pipe';
import EquipmentUpdate from 'src/dto/update/equipment.update';

@ApiTags('Equipment')
@Controller('equipment')
export default class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: Equipment,
    isArray: false
  })
  @ApiParam({ type: String, required: true, name: 'id' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', new ParseUUIDPipe()) id: Buffer): Promise<Equipment | undefined> {
    const equipment = await this.service.findById(id);
    if (equipment === undefined) throw new NotFoundException(`No equipment found with id : ${id.toString('base64url')}`);
    return equipment;
  }

  @Post()
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
  async getUsingDTO(@Body() equipmentDTO: EquipmentDTO, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number): Promise<Equipment[]> {
    const equipmentParam = equipmentDTO;
    const installationDTO = equipmentDTO.installation;
    if (equipmentParam.name) {
      const last = `>${equipmentParam.name.pop()}*`;
      equipmentParam.name = [...new Set(equipmentParam.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      equipmentParam.name.push(last);
    }

    if (installationDTO?.name) {
      const last = `>${installationDTO.name.pop()}*`;
      installationDTO.name = [...new Set(installationDTO.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      installationDTO.name.push(last);
    }

    if (installationDTO?.address?.city) {
      if (installationDTO.address?.city?.names) {
        installationDTO.address.city.names = [...new Set(installationDTO.address.city.names)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      }
      if (installationDTO?.address.city.zipcode) throw new NotAcceptableException('Zip code is not allowed here');
      if (installationDTO.address.city.ids) {
        installationDTO.address.city.ids = [...new Set(installationDTO.address.city.ids)];
      }
    }

    if (installationDTO !== undefined) equipmentParam.installation = installationDTO;

    await validate(equipmentParam).then((errors) => {
      if (errors.length > 0) {
        throw new NotAcceptableException(errors.map((err) => err.toString()));
      }
    });

    return this.service.findUsingDTO(equipmentParam, offset < 0 ? 0 : offset);
  }

  @Patch()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Udapted equipment',
    type: Equipment
  })
  @ApiNotAcceptableResponse({ description: 'Equipment CU is not valid.' })
  @ApiBody({ type: EquipmentUpdate })
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() equipmentU: EquipmentUpdate) : Promise<Equipment> {
    if (!equipmentU.id) throw new NotAcceptableException('id must be provided in order to update equipment');

    const errors = await validate(equipmentU, { skipUndefinedProperties: true });

    if (errors.length > 0) throw new NotAcceptableException(errors);

    return this.service.update({ ...equipmentU, id: Buffer.from(equipmentU.id) });
  }
}

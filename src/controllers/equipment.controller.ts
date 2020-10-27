import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import SportService from 'src/services/equipment.service';
import Equipment from 'src/entities/equipment.entity';
import EquipmentDTO from 'src/dto/equipment.dto';

@ApiTags('equipment')
@Controller('equipments')
export default class EquipmentController {
  constructor(private readonly equipmentService: SportService) {}

  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: Equipment,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Equipment> {
    const equipment = await this.equipmentService.findById(id);
    if (equipment === undefined) throw new NotFoundException(`No equipment found with id : ${id}`);
    return equipment;
  }

  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: Equipment,
    isArray: true
  })
  @ApiBody({
    type: EquipmentDTO
  })
  @ApiQuery({
    name: 'offset',
    required: false
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async getUsingDTO(@Body() equipmentDTO: EquipmentDTO, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number): Promise<Equipment[]> {
    return this.equipmentService.findUsingDTO(equipmentDTO, offset || 0);
  }
}

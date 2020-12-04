import {
  ClassSerializerInterceptor, Controller, Get, UseInterceptors
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import Owner from 'src/entities/owner.entity';
import OwnerService from 'src/services/owner.service';

@ApiTags('Owner')
@Controller('owner')
export default class OwnerController {
  constructor(private readonly service: OwnerService) {}

  @ApiResponse({
    status: 200,
    description: 'Owner list',
    type: Owner,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getCategories(): Promise<Owner[]> {
    return this.service.findAll();
  }
}

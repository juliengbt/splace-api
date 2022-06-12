import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import Owner from 'src/models/owner/owner.entity';
import OwnerService from 'src/models/owner/owner.service';

@ApiTags('Owner')
@Controller('owner')
export default class OwnerController {
  constructor(private readonly service: OwnerService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'Owner list',
    type: Owner,
    isArray: true
  })
  getOwners(): Promise<Owner[]> {
    return this.service.findAll();
  }
}

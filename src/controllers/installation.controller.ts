import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import Installation from 'src/entities/installation.entity';
import InstallationService from 'src/services/installation.service';

@ApiTags('Installation')
@Controller('installation')
export default class InstallationController {
  constructor(private readonly service: InstallationService) {}

  @ApiResponse({
    status: 200,
    description: 'Installation list',
    type: Installation,
    isArray: true
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Installation> {
    const installation = await this.service.findById(id);
    if (installation === undefined) throw new NotFoundException(`No installation found with id : ${id}`);
    return installation;
  }
}

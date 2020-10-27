import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import SportService from 'src/services/installation.service';
import Installation from 'src/entities/installation.entity';

@ApiTags('installation')
@Controller('installations')
export default class InstallationController {
  constructor(private readonly installationService: SportService) {}

  @ApiResponse({
    status: 200,
    description: 'Installation list',
    type: Installation,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Installation> {
    const installation = await this.installationService.findById(id);
    if (installation === undefined) throw new NotFoundException(`No installation found with id : ${id}`);
    return installation;
  }
}

import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import Installation from 'src/models/installation/installation.entity';
import ParseBase64IDPipe from 'src/pipes/parse-base64id.pipe';
import InstallationService from 'src/models/installation/installation.service';

@ApiTags('Installation')
@Controller('installation')
export default class InstallationController {
  constructor(private readonly service: InstallationService) {}

  @ApiOkResponse({
    description: 'Installation list',
    type: Installation,
    isArray: true
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiParam({ required: true, type: String, name: 'id' })
  @Get(':id')
  async getById(@Param('id', new ParseBase64IDPipe()) id: Buffer): Promise<Installation> {
    const installation = await this.service.findById(id);
    if (!installation)
      throw new NotFoundException(`No installation found with id : ${id.toString('base64url')}`);
    return installation;
  }
}

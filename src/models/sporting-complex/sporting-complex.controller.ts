import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import SportingComplex from './sporting-complex.entity';
import SportingComplexService from './sporting-complex.service';

@ApiTags('SportingComplex')
@Controller('sporting-complex')
export default class SportingComplexController {
  constructor(private readonly service: SportingComplexService) {}

  @ApiOkResponse({
    description: 'SportingComplex list',
    type: SportingComplex,
    isArray: true
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiParam({ required: true, type: String, name: 'id' })
  @Get(':id')
  async getById(@Param('id') id: string): Promise<SportingComplex> {
    const installation = await this.service.findById(id);
    if (!installation) throw new NotFoundException(`No installation found with id : ${id}`);
    return installation;
  }
}

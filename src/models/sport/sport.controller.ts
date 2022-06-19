import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiParam, ApiQuery, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import SportService from 'src/models/sport/sport.service';
import Sport from 'src/models/sport/sport.entity';
import { Public } from 'src/decorators/public';

@ApiTags('Sport')
@Controller('sport')
export default class SportController {
  constructor(private readonly service: SportService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'Sports list',
    type: Sport,
    isArray: true
  })
  @ApiQuery({ name: 'category', required: false })
  getSports(@Query('category') category?: string): Promise<Sport[]> {
    if (category) return this.service.findByCategory(category);
    return this.service.findAll();
  }

  @ApiOkResponse({
    description: 'Sport object',
    type: Sport
  })
  @ApiParam({ name: 'code', required: true })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @Get('/code/:code')
  async getSportByCode(@Param('code') code: string): Promise<Sport> {
    const sport = await this.service.findByCode(code);
    if (!sport) throw new NotFoundException(`No sports found with code like ${code}`);
    return sport;
  }
}

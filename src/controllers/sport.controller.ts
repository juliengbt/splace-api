import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import SportService from 'src/services/sport.service';
import Sport from 'src/entities/sport.entity';

@ApiTags('Sport')
@Controller('sport')
export default class SportController {
  constructor(private readonly service: SportService) {}

  @ApiResponse({
    status: 200,
    description: 'Sports list',
    type: Sport,
    isArray: true
  })
  @ApiQuery({ name: 'category', required: false })
  @Get()
  getSports(@Query('category') category?: string): Promise<Sport[]> {
    if (category) return this.service.findByCategory(category);
    return this.service.findAll();
  }

  @ApiResponse({
    status: 200,
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

  @ApiResponse({
    status: 200,
    description: 'Sport object',
    type: Sport
  })
  @Post('/add')
  addSport(@Body('sport') sport: Sport): Promise<Partial<Sport>> {
    return this.service.save(sport);
  }
}

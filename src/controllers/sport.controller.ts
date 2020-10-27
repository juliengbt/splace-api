import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import SportService from 'src/services/sport.service';
import Sport from 'src/entities/sport.entity';

@ApiTags('sport')
@Controller('sports')
export default class SportController {
  constructor(private readonly sportService: SportService) {}

  @ApiResponse({
    status: 200,
    description: 'Sports list',
    type: Sport,
    isArray: true
  })
  @ApiQuery({
    name: 'category',
    required: false
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  getSports(@Query('category') category?: string): Promise<Sport[]> {
    if (category) return this.sportService.findByCategory(category);
    return this.sportService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Sport object',
    type: Sport
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':code')
  async getSportByCode(@Param('code') code:string): Promise<Sport> {
    const sport = await this.sportService.findByCode(code);
    if (sport === undefined) throw new NotFoundException(`No sports found with code like ${code}`);
    return sport;
  }
}

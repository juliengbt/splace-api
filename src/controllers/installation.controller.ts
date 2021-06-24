import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  PartialType
} from '@nestjs/swagger';
import { validate } from 'class-validator';
import InstallationCU from 'src/dto/cu/installation.cu';
import Installation from 'src/entities/installation.entity';
import ParseUUIDPipe from 'src/pipes/parse-uuid.pipe';
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
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Installation> {
    const installation = await this.service.findById(id);
    if (installation === undefined) throw new NotFoundException(`No installation found with id : ${id}`);
    return installation;
  }

  @Patch()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Udapted equipment',
    type: Installation
  })
  @ApiNotAcceptableResponse({ description: 'Equipment CU is not valid.' })
  @ApiBody({ type: PartialType(InstallationCU) })
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() installationCU: Partial<InstallationCU>) : Promise<Installation> {
    if (!installationCU.id) throw new NotAcceptableException('id must be provided in order to update installation');

    const errors = await validate(installationCU, { skipUndefinedProperties: true });

    if (errors.length > 0) throw new NotAcceptableException(errors);

    return this.service.update(installationCU);
  }
}

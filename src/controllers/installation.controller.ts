import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
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
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { validate } from 'class-validator';
import InstallationUpdate from 'src/dto/update/installation.update';
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
  @ApiParam({ required: true, type: String, name: 'id' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: Buffer): Promise<Installation> {
    const installation = await this.service.findById(id);
    if (installation === undefined) throw new NotFoundException(`No installation found with id : ${id.toString('base64url')}`);
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
  @ApiBody({ type: InstallationUpdate })
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() installationU: InstallationUpdate) : Promise<Installation> {
    if (!installationU.id) throw new NotAcceptableException('id must be provided in order to update installation');

    const errors = await validate(installationU, { skipUndefinedProperties: true });

    if (errors.length > 0) throw new NotAcceptableException(errors);

    this.service.update(installationU);
    const res = await this.service.findById(installationU.id);

    if (!res) throw new InternalServerErrorException();
    return res;
  }
}

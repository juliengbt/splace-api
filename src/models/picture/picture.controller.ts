import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Picture')
@Controller('picture')
export default class PictureController {}

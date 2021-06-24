import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Query,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody, ApiResponse, ApiTags, PartialType
} from '@nestjs/swagger';
import PictureCU from 'src/dto/cu/picture.cu';
import PictureService from 'src/services/picture.service';
import { unlink } from 'fs';
import path from 'path';
import ParseUUIDPipe from 'src/pipes/parse-uuid.pipe';

@ApiTags('Picture')
@Controller('picture')
export default class PictureController {
  constructor(private readonly service: PictureService) {}

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Removed picture list',
    type: Number
  })
  @ApiBody({ type: PartialType(PictureCU), isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  remove(
    @Query('id_equipment', new ParseUUIDPipe()) id_equipment: string,
      @Body() pictures: PictureCU[]
  ): Promise<number> {
    const b64id = Buffer.from(id_equipment, 'hex').toString('base64url');
    pictures.forEach(
      (p) => unlink(
        path.join(process.env.IMAGES_LOCATION, b64id, p.name),
        () => {}
      )
    );
    return this.service.removeAll(Buffer.from(id_equipment, 'hex'), pictures)
      .then((v) => (!v && v !== 0 ? 0 : v));
  }
}

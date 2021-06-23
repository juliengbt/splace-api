import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import PictureCU from 'src/dto/cu/picture.cu';
import Picture from 'src/entities/picture.entity';
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
    type: Picture,
    isArray: true
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe())
  getOwners(
    @Query('id_equipment', new ParseUUIDPipe()) id_equipment: string,
      @Body() pictures: PictureCU[]
  ): Promise<number | null | undefined> {
    const b64id = Buffer.from(id_equipment, 'hex').toString('base64url');
    pictures.forEach(
      (p) => unlink(
        path.join(process.env.IMAGES_LOCATION, b64id, p.name),
        () => {}
      )
    );
    return this.service.removeAll(Buffer.from(id_equipment, 'hex'), pictures);
  }
}

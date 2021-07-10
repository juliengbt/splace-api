import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotAcceptableException,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody, ApiConsumes, ApiNotAcceptableResponse, ApiQuery, ApiResponse, ApiTags
} from '@nestjs/swagger';
import PictureService from 'src/services/picture.service';
import ParseUUIDPipe from 'src/pipes/parse-uuid.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import {
  existsSync, mkdirSync, rename, unlink
} from 'fs';
import EquipmentService from 'src/services/equipment.service';
import Picture from 'src/entities/picture.entity';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = process.env.IMAGES_LOCATION;
    // Create folder if doesn't exist
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const filename = nanoid(15);
    const { ext } = path.parse(file.originalname);
    cb(null, `${filename}${ext}`);
  }
});

@ApiTags('Picture')
@Controller('picture')
export default class PictureController {
  constructor(private readonly service: PictureService,
    private readonly equipmentService : EquipmentService) {}

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Removed picture list',
    type: Number
  })
  @ApiBody({ type: String, isArray: true })
  @ApiQuery({ type: String, required: true, name: 'id_equipment' })
  async remove(
    @Query('id_equipment', new ParseUUIDPipe()) id_equipment: Buffer,
      @Body() pictures: string[]
  ): Promise<number> {
    const b64id = id_equipment.toString('base64url');
    pictures.forEach(
      (p) => unlink(
        path.join(process.env.IMAGES_LOCATION, b64id, p),
        () => {}
      )
    );
    return this.service.removeAll(id_equipment, pictures)
      .then((v) => (!v && v !== 0 ? 0 : v));
  }

  @Post()
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Images added'
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    }
  })
  @ApiQuery({ type: String, required: true, name: 'id' })
  @ApiNotAcceptableResponse()
  @UseInterceptors(FilesInterceptor('files', undefined, {
    storage,
    fileFilter(_req, file, cb) {
      const acceptedFiles = ['image/jpeg', 'image/png'];
      if (!acceptedFiles.includes(file.mimetype)) {
        return cb(new NotAcceptableException('Mimetype not accepted'), false);
      }
      if (file.size > parseInt(process.env.IMAGES_MAX_SIZE || '1048576', 10)) {
        return cb(new NotAcceptableException('Size too large'), false);
      }
      return cb(null, true);
    }
  }))
  async addImages(
    @Query('id', new ParseUUIDPipe()) id: Buffer,
      @UploadedFiles() files: Array<Express.Multer.File>
  ) : Promise<number> {
    if (!id || !(await this.equipmentService.findById(id))) {
      files.forEach((f) => unlink(f.path, () => {}));
      throw new NotAcceptableException(`equipment with id : ${id.toString('base64url')} does not exists`);
    }

    if (files) {
      files.forEach((f) => {
        const b64id = id.toString('base64url');
        const uploadPath = path.join(f.destination, b64id);
        // Create folder if doesn't exist
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath);
        }
        rename(f.path, path.join(uploadPath, f.filename), () => {});
      });
      return this.service.addImages(id, files);
    }
    return 0;
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Picture array',
    type: Picture,
    isArray: true
  })
  @ApiQuery({ type: String, required: true, name: 'id_equipment' })
  async pictureOfEquipment(@Query('id_equipment', new ParseUUIDPipe()) id_equipment: Buffer) : Promise<Picture[]> {
    return this.service.findImages(id_equipment);
  }
}

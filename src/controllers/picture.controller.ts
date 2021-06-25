import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
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
import Picture from 'src/entities/picture.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import {
  existsSync, mkdirSync, rename, unlink
} from 'fs';
import EquipmentService from 'src/services/equipment.service';

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
  @ApiBody({ type: Picture, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  remove(
    @Query('id_equipment', new ParseUUIDPipe()) id_equipment: string,
      @Body() pictures: Picture[]
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
        return cb(new Error('goes wrong on the mimetype'), false);
      }
      if (file.size > parseInt(process.env.IMAGES_MAX_SIZE || '1048576', 10)) {
        return cb(new Error('size too large'), false);
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
}

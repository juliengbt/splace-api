/* eslint-disable max-len */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Post,
  UseInterceptors,
  NotFoundException,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  UploadedFiles,
  Patch,
  HttpCode
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import Equipment from 'src/entities/equipment.entity';
import EquipmentDTO from 'src/dto/search/equipment.dto';
import EquipmentService from 'src/services/equipment.service';
import { validate } from 'class-validator';
import ParseUUIDPipe from 'src/pipes/parse-uuid.pipe';
import EquipmentCU from 'src/dto/cu/equipment.cu';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import { existsSync, mkdirSync, rename } from 'fs';

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

@ApiTags('Equipment')
@Controller('equipment')
export default class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: Equipment,
    isArray: false
  })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiNotAcceptableResponse({ description: 'The parameter id must a uuid' })
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Equipment | undefined> {
    const equipment = await this.service.findById(id);
    if (equipment === undefined) throw new NotFoundException(`No equipment found with id : ${id}`);
    return equipment;
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Equipment list',
    type: Equipment,
    isArray: true
  })
  @ApiNotAcceptableResponse({ description: 'Equipment DTO is not valid.' })
  @ApiBody({ type: EquipmentDTO })
  @ApiQuery({ name: 'offset', required: false })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsingDTO(@Body() equipmentDTO: EquipmentDTO, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number): Promise<Equipment[]> {
    const equipmentParam = equipmentDTO;
    const installationDTO = equipmentDTO.installation;
    if (equipmentParam.name) {
      const last = `>${equipmentParam.name.pop()}*`;
      equipmentParam.name = [...new Set(equipmentParam.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      equipmentParam.name.push(last);
    }

    if (installationDTO?.name) {
      const last = `>${installationDTO.name.pop()}*`;
      installationDTO.name = [...new Set(installationDTO.name)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      installationDTO.name.push(last);
    }

    if (installationDTO?.address?.city) {
      if (installationDTO.address?.city?.names) {
        installationDTO.address.city.names = [...new Set(installationDTO.address.city.names)].flatMap((x) => x.split(' ')).filter((str) => str.length > 2);
      }
      if (installationDTO?.address.city.zipcode) throw new NotAcceptableException('Zip code is not allowed here');
      if (installationDTO.address.city.ids) {
        installationDTO.address.city.ids = [...new Set(installationDTO.address.city.ids)];
      }
    }

    equipmentParam.installation = installationDTO;

    await validate(equipmentParam).then((errors) => {
      if (errors.length > 0) {
        throw new NotAcceptableException(errors.map((err) => err.toString()));
      }
    });

    if (Object.keys(equipmentParam).length === 0 && equipmentParam.constructor === Object) throw new NotAcceptableException('equipmentDTO is empty');
    return this.service.findUsingDTO(equipmentParam, offset < 0 ? 0 : offset);
  }

  @Patch()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Udapted equipment',
    type: Equipment
  })
  @ApiNotAcceptableResponse({ description: 'Equipment CU is not valid.' })
  @ApiBody({ type: EquipmentCU })
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() equipmentCU: Partial<EquipmentCU>) : Promise<Equipment> {
    if (!equipmentCU.id) throw new NotAcceptableException('id must be provided in order to update equipment');

    const errors = await validate(equipmentCU, { skipUndefinedProperties: true });

    if (errors.length > 0) throw new NotAcceptableException(errors);

    return this.service.update(equipmentCU);
  }

  @Patch('addImages')
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Images added'
  })
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
    @Query('id', new ParseUUIDPipe()) id: string,
      @UploadedFiles() files?: Array<Express.Multer.File>
  ) : Promise<number> {
    if (!id) throw new NotAcceptableException('id must be provided in order to update equipment');

    if (files) {
      files.forEach((f) => {
        const b64id = Buffer.from(id, 'hex').toString('base64url');
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

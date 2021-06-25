import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import PictureController from 'src/controllers/picture.controller';
import Picture from 'src/entities/picture.entity';
import PictureService from 'src/services/picture.service';
import EquipmentModule from './equipment.module';

@Module({
  imports: [EquipmentModule, TypeOrmModule.forFeature([Picture])],
  exports: [],
  controllers: [PictureController],
  providers: [PictureService]
})
export default class PictureModule {}

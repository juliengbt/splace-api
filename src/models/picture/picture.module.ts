import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import PictureController from 'src/models/picture/picture.controller';
import Picture from 'src/models/picture/picture.entity';
import PictureService from 'src/models/picture/picture.service';
import EquipmentModule from '../equipment/equipment.module';

@Module({
  imports: [EquipmentModule, TypeOrmModule.forFeature([Picture])],
  exports: [],
  controllers: [PictureController],
  providers: [PictureService]
})
export default class PictureModule {}

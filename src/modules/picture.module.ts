import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import PictureController from 'src/controllers/picture.controller';
import Picture from 'src/entities/picture.entity';
import PictureService from 'src/services/picture.service';

@Module({
  imports: [TypeOrmModule.forFeature([Picture])],
  exports: [TypeOrmModule],
  controllers: [PictureController],
  providers: [PictureService]
})
export default class PictureModule {}

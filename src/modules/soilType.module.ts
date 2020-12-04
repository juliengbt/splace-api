import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import SoilType from 'src/entities/soilType.entity';
import SoilTypeService from 'src/services/soilType.service';
import SoilTypeController from 'src/controllers/soilType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SoilType])],
  exports: [TypeOrmModule],
  controllers: [SoilTypeController],
  providers: [SoilTypeService]
})
export default class SoilTypeModule {}

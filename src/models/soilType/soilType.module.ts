import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import SoilType from 'src/models/soilType/soilType.entity';
import SoilTypeService from 'src/models/soilType/soilType.service';
import SoilTypeController from 'src/models/soilType/soilType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SoilType])],
  exports: [TypeOrmModule],
  controllers: [SoilTypeController],
  providers: [SoilTypeService]
})
export default class SoilTypeModule {}

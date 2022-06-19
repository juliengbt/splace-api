import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import SoilType from 'src/models/soilType/soilType.entity';
import SoilTypeService from 'src/models/soilType/soilType.service';

@Module({
  imports: [TypeOrmModule.forFeature([SoilType])],
  exports: [SoilTypeService],
  controllers: [],
  providers: [SoilTypeService]
})
export default class SoilTypeModule {}

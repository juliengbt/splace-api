import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import City from 'src/models/city/city.entity';
import CityService from 'src/models/city/city.service';
import CityController from 'src/models/city/city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  exports: [TypeOrmModule],
  controllers: [CityController],
  providers: [CityService]
})
export default class CityModule {}

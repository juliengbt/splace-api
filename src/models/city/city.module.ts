import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesExistRule } from 'src/decorators/citiesExists';
import CityController from 'src/models/city/city.controller';
import City from 'src/models/city/city.entity';
import CityService from 'src/models/city/city.service';
import { CitySubscriber } from './city.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  exports: [TypeOrmModule],
  controllers: [CityController],
  providers: [CityService, CitiesExistRule, CitySubscriber]
})
export default class CityModule {}

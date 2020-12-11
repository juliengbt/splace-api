import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import City from 'src/entities/city.entity';
import CityService from 'src/services/city.service';
import CityController from 'src/controllers/city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  exports: [TypeOrmModule],
  controllers: [CityController],
  providers: [CityService]
})
export default class CityModule {}

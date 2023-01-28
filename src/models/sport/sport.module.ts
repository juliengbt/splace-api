import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsExistRule } from 'src/decorators/sportsExist';
import SportController from 'src/models/sport/sport.controller';
import Sport from 'src/models/sport/sport.entity';
import SportService from 'src/models/sport/sport.service';
import { SportSubscriber } from './sport.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  exports: [TypeOrmModule, SportService],
  controllers: [SportController],
  providers: [SportService, SportsExistRule, SportSubscriber]
})
export default class SportModule {}

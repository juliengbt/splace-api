import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import SportService from 'src/models/sport/sport.service';
import SportController from 'src/models/sport/sport.controller';
import Sport from 'src/models/sport/sport.entity';
import { SportsExistRule } from 'src/decorators/sportsExist';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  exports: [TypeOrmModule, SportService],
  controllers: [SportController],
  providers: [SportService, SportsExistRule]
})
export default class SportModule {}

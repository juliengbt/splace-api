import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import SportService from 'src/models/sport/sport.service';
import SportController from 'src/models/sport/sport.controller';
import Sport from 'src/models/sport/sport.entity';
import { SportExistsRule } from 'src/decorators/sportExists';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  exports: [TypeOrmModule, SportService],
  controllers: [SportController],
  providers: [SportService, SportExistsRule]
})
export default class SportModule {}

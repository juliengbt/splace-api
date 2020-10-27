import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import SportService from 'src/services/sport.service';
import SportController from 'src/controllers/sport.controller';
import Sport from 'src/entities/sport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  exports: [TypeOrmModule],
  controllers: [SportController],
  providers: [SportService]
})
export default class SportModule {}

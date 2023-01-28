import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import SportingComplexController from 'src/models/sporting-complex/sporting-complex.controller';
import SportingComplex from 'src/models/sporting-complex/sporting-complex.entity';
import SportingComplexService from 'src/models/sporting-complex/sporting-complex.service';
import { SportingComplexSubscriber } from './sporting-complex.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([SportingComplex])],
  exports: [SportingComplexService],
  controllers: [SportingComplexController],
  providers: [SportingComplexService, SportingComplexSubscriber]
})
export default class SportingComplexModule {}

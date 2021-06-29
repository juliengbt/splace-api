import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Zipcode from 'src/entities/zipcode.entity';
import ZipcodeService from 'src/services/zipcode.service';
import ZipcodeController from 'src/controllers/zipcode.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Zipcode])],
  exports: [],
  controllers: [ZipcodeController],
  providers: [ZipcodeService]
})
export default class ZipcodeModule {}

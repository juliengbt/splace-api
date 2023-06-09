import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Zipcode from 'src/models/zipcode/zipcode.entity';
import ZipcodeService from 'src/models/zipcode/zipcode.service';
import ZipcodeController from 'src/models/zipcode/zipcode.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Zipcode])],
  exports: [],
  controllers: [ZipcodeController],
  providers: [ZipcodeService]
})
export default class ZipcodeModule {}

import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Owner from 'src/models/owner/owner.entity';
import OwnerService from 'src/models/owner/owner.service';
import OwnerController from 'src/models/owner/owner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  exports: [TypeOrmModule],
  controllers: [OwnerController],
  providers: [OwnerService]
})
export default class OwnerModule {}

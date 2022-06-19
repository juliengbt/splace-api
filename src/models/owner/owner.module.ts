import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Owner from 'src/models/owner/owner.entity';
import OwnerService from 'src/models/owner/owner.service';

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  exports: [OwnerService],
  controllers: [],
  providers: [OwnerService]
})
export default class OwnerModule {}

import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import Owner from 'src/entities/owner.entity';
import OwnerService from 'src/services/owner.service';
import OwnerController from 'src/controllers/owner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  exports: [TypeOrmModule],
  controllers: [OwnerController],
  providers: [OwnerService]
})
export default class OwnerModule {}

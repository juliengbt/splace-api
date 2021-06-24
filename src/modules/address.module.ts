import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import AddressController from 'src/controllers/address.controller';
import Address from 'src/entities/address.entity';
import Installation from 'src/entities/installation.entity';
import AddressService from 'src/services/address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Installation])],
  exports: [TypeOrmModule],
  controllers: [AddressController],
  providers: [AddressService]
})
export default class AddressModule {}

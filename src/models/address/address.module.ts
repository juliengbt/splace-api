import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import AddressController from 'src/models/address/address.controller';
import Address from 'src/models/address/address.entity';
import AddressService from 'src/models/address/address.service';
import SportingComplexModule from '../sporting-complex/sporting-complex.module';
import { AddressSubscriber } from './address.subscriber';

@Module({
  imports: [SportingComplexModule, TypeOrmModule.forFeature([Address])],
  exports: [],
  controllers: [AddressController],
  providers: [AddressService, AddressSubscriber]
})
export default class AddressModule {}

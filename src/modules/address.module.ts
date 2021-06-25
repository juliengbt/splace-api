import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import AddressController from 'src/controllers/address.controller';
import Address from 'src/entities/address.entity';
import AddressService from 'src/services/address.service';
import InstallationModule from './installation.module';

@Module({
  imports: [InstallationModule, TypeOrmModule.forFeature([Address])],
  exports: [],
  controllers: [AddressController],
  providers: [AddressService]
})
export default class AddressModule {}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  NotAcceptableException,
  Patch, UseInterceptors
} from '@nestjs/common';
import { ApiNotAcceptableResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';
import AddressCU from 'src/dto/cu/address.cu';
import Address from 'src/entities/address.entity';
import AddressService from 'src/services/address.service';
import { DeepPartial } from 'typeorm';

@ApiTags('Address')
@Controller('address')
export default class AddressController {
  constructor(private readonly service: AddressService) {}

  @Patch()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Updated or created address',
    type: Address,
    isArray: true
  })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() addressCU: Partial<AddressCU>): Promise<Address> {
    if (!addressCU.id) throw new NotAcceptableException('id must be provided in order to update address');

    const errors = await validate(addressCU, { skipUndefinedProperties: true });

    if (errors.length > 0) throw new NotAcceptableException(errors);

    const address = await this.service.findById(addressCU.id);
    if (!address) throw new NotAcceptableException(`No address with id : ${addressCU.id}`);

    const count = await this.service.countInstallation(addressCU.id);
    let object: DeepPartial<Address> = addressCU;

    if (count > 1) {
      object = { ...address, ...addressCU, id: undefined };
    }

    return this.service.save(object);
  }
}

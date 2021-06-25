import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  NotAcceptableException,
  Patch, UseInterceptors
} from '@nestjs/common';
import {
  ApiBody, ApiNotAcceptableResponse, ApiResponse, ApiTags
} from '@nestjs/swagger';
import { validate } from 'class-validator';
import AddressUpdate from 'src/dto/update/address.update';
import Address from 'src/entities/address.entity';
import AddressService from 'src/services/address.service';
import InstallationService from 'src/services/installation.service';
import { DeepPartial } from 'typeorm';

@ApiTags('Address')
@Controller('address')
export default class AddressController {
  constructor(private readonly service: AddressService,
    private readonly installationService: InstallationService) {}

  @Patch()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Updated or created address',
    type: Address
  })
  @ApiBody({ type: AddressUpdate })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() addressU: AddressUpdate): Promise<Address> {
    if (!addressU.id) throw new NotAcceptableException('id must be provided in order to update address');

    const errors = await validate(addressU, { skipUndefinedProperties: true });

    if (errors.length > 0) throw new NotAcceptableException(errors);

    const address = await this.service.findById(addressU.id);
    if (!address) throw new NotAcceptableException(`No address with id : ${addressU.id.toString('base64url')}`);

    const count = await this.installationService.countInstallationWithAddress(addressU.id);
    let object: DeepPartial<Address> = addressU;

    if (count > 1) {
      object = { ...address, ...addressU, id: undefined };
    }

    return this.service.save(object);
  }
}

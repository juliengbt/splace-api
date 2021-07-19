import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  NotAcceptableException,
  Patch, Put, Query, UseInterceptors
} from '@nestjs/common';
import {
  ApiBody, ApiNotAcceptableResponse, ApiQuery, ApiResponse, ApiTags
} from '@nestjs/swagger';
import AddressCreate from 'src/dto/create/address.create';
import AddressUpdate from 'src/dto/update/address.update';
import Address from 'src/entities/address.entity';
import ParseUUIDPipe from 'src/pipes/parse-uuid.pipe';
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
    description: 'Updated address',
    type: Address
  })
  @ApiBody({ type: AddressUpdate })
  @ApiQuery({ type: String, required: true, name: 'id_installation' })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Query('id_installation', new ParseUUIDPipe()) id_installation: Buffer,
    @Body() addressU: AddressUpdate): Promise<Address> {
    if (!addressU.id) throw new NotAcceptableException('id must be provided in order to update address');

    const address = await this.service.findById(addressU.id);
    if (!address) throw new NotAcceptableException(`No address with id : ${addressU.id.toString('base64url')}`);

    const count = await this.installationService.countInstallationWithAddress(addressU.id);

    let object: DeepPartial<AddressUpdate> = addressU;
    const existingAdress = await this.service.exists({ ...address, ...addressU });

    if (existingAdress) {
      const installation = await this.installationService.findById(id_installation);
      if (!installation) throw new NotAcceptableException(`No installation with id : ${id_installation.toString('base64url')}`);

      await this.installationService
        .update({ id: id_installation, address: existingAdress });
      if (count === 1) await this.service.delete(addressU.id);

      return existingAdress;
    }

    if (count > 1) {
      object = { ...address, ...addressU } as DeepPartial<AddressCreate>;
      delete object.id;
    }

    return this.service.save(object);
  }

  @Put()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Created address',
    type: Address
  })
  @ApiBody({ type: AddressCreate })
  @ApiNotAcceptableResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() addressC: AddressCreate): Promise<Address> {
    if (addressC.id) throw new NotAcceptableException("can't use id field here");

    return this.service.save(addressC);
  }
}

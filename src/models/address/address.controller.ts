import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Address')
@Controller('address')
export default class AddressController {}

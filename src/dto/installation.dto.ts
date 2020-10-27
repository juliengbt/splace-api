import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import AddressDTO from './address.dto';
import CityDTO from './city.dto';

export default class InstallationDTO {
  @ApiProperty({ type: () => String, required: false })
  @IsUUID()
  id?: string;

  @ApiProperty({ type: () => String, required: false })
  name?: string;

  @ApiProperty({ type: () => Boolean, required: false })
  car_park?: boolean | null;

  @ApiProperty({ type: () => Boolean, required: false })
  disabled_access?: boolean | null;

  @ApiProperty({ type: () => AddressDTO, required: false })
  @ValidateNested()
  @IsOptional()
  address?: AddressDTO | null;

  @ApiProperty({ type: () => CityDTO, required: false })
  @ValidateNested()
  @IsOptional()
  city?: CityDTO | null;
}

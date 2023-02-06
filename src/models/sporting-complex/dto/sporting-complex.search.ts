import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator';
import AddressSearch from '../../address/dto/address.search';

export default class SportingComplexSearch {
  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'car_park must be a boolean value' })
  @IsOptional()
  carPark?: boolean | null;

  @ApiProperty({ type: () => Boolean, required: false })
  @IsBoolean({ message: 'disabled_access must be a boolean value' })
  @IsOptional()
  disabledAccess?: boolean | null;

  @ApiProperty({ type: () => AddressSearch, required: false })
  @ValidateNested()
  @Type(() => AddressSearch)
  @IsOptional()
  @IsNotEmptyObject()
  address?: AddressSearch | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export default class AddressDTO {
  @ApiProperty({ type: String, required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String, required: false })
  street_num?: string | null;

  @ApiProperty({ type: String, required: false })
  street_name?: string | null;

  @ApiProperty({ type: String, required: false })
  locality?: string | null;

  @ApiProperty({ type: String, required: false })
  district?: number | null;
}

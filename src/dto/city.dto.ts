import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export default class CityDTO {
  @ApiProperty({ type: String, required: false })
  @IsUUID()
  @IsOptional()
  id?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, Length } from 'class-validator';

export default class DepartmentDTO {
  @ApiProperty({ type: String, required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String, required: false })
  @Length(2, 3, { message: 'Num must be between 2 and 3 characters' })
  @IsOptional()
  num?: string;
}

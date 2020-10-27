import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length, ValidateNested } from 'class-validator';
import CategoryDTO from './category.dto';

export default class SportDTO {
  @ApiProperty({ type: () => String, required: false })
  @Length(3, 10, { message: 'Code must be between 3 and 10 characters' })
  code?: string;

  @ApiProperty({ type: () => String, required: false })
  name?: string;

  @ApiProperty({ type: () => String, required: false })
  description?: string | null;

  @ApiProperty({ type: () => String, required: false })
  federation?: string | null;

  @ApiProperty({ type: () => CategoryDTO, required: false })
  @ValidateNested()
  @IsOptional()
  category?: CategoryDTO | null;
}

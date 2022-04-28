import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class BaseUserSignin {
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

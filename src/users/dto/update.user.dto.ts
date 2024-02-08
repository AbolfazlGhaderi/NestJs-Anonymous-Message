import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  displayName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  slug: string;
}

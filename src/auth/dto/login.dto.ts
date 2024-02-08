import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'At the first time, the email is sent to the server',
  })
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'then the email along with the confirmation code is sent to the same address.',
    required: false,
  })
  code?: string;
}

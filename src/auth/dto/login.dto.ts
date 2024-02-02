import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;
}

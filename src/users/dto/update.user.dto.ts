import { IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateDTO {
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}

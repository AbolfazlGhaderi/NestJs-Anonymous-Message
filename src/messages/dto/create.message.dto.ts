import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

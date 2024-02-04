import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {}

export class FindAllMessageDTO {
  @IsNotEmpty()
  @IsString()
  slug: string;
}

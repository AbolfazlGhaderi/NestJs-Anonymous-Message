import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  slug: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
  })
  text: string;
}

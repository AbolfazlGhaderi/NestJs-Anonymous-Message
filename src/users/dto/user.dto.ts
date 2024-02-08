import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    displayName:string;
    @ApiProperty()
    slug:string
}
 

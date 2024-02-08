import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '200',
        },
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'Wrong Code',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'error' })
  async login(@Body() userDto: LoginDTO) {
    return await this.authService.login(userDto);
  }
}

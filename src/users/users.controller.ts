import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  Put,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard.guard';
import { UserUpdateDTO } from './dto/update.user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/whoami')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Your complete information',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'user not found',
        },
      },
    },
  })
  async whoiam(@Req() request: Request) {
    const jwtUserEmail = request.user['email'];

    //-------------------- User Search in the DB ----------------------------------

    const user = await this.usersService.findUserByEmail(jwtUserEmail);

    //-------------------- return the user ------------------------------------------

    if (user && user.email === jwtUserEmail) {
      return {
        email: user.email,
        slug: user.slug,
        displayName: user.displayName,
      };
    } else {
      throw new HttpException('User not found', 404);
    }
  }

  // Is this slug already used or not?

  @Post('/check/slug')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 400, description: 'Not available' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'available' })
  @ApiBody({
    schema: {
      properties: {
        slug: {
          type: 'string',
        },
      },
    },
  })
  async checkSlug(@Body('slug') slug: string) {
    return await this.usersService.checkSlug(slug);
  }

  @Put('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      properties: {
        statusCode: {
          type: 'number',
          example: '404',
        },
        message: {
          type: 'string',
          example: 'user not found',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'ok' })
  async Update(@Req() request: Request, @Body() userData: UserUpdateDTO) {
    return await this.usersService.update(userData, request.user['email']);
  }
}

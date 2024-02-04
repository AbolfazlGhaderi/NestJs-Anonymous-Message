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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/whoami')
  @UseGuards(JwtAuthGuard)
  async whoiam(@Req() request: Request) {
    
    const jwtUserEmail= request.user['email']

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
}

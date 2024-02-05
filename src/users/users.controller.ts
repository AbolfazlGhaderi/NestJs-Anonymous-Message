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
import { CreateUserDto } from './dto/create.user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard.guard';
import { UserUpdateDTO } from './dto/update.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/whoami')
  @UseGuards(JwtAuthGuard)
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

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async Update( @Param('id', ParseIntPipe) id: number , @Body() userData: UserUpdateDTO,) {

    return await this.usersService.update(userData,id);
    
  }

  @Post('/check/slug')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async checkSlug(@Body('slug') slug : string){
    return await this.usersService.checkSlug(slug)
  }
}

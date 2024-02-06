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
  ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard.guard';
import { Request } from 'express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  //--------------------- Receive all messages --------------------
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMessage(@Req() request: Request) {
    return await this.messagesService.findAllMessage(request.user['email']);
  }

  //---------------------- Delete a message ----------------------
  
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    
    return this.messagesService.deleteOne(id)
    
  }
  
  //---------------------- Delete messages ----------------------

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async deleteAll(@Req() request:Request){
    console.log(request.user['email']);
    return await this.messagesService.deleteAll(request.user['email'])

  }
}

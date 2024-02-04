import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard.guard';
import { FindAllMessageDTO } from './dto/message.dto';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMessage(@Body() userSlug:FindAllMessageDTO){
    return await this.messagesService.findAllMessage(userSlug.slug)
  }

}

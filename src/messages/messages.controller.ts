import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}


}

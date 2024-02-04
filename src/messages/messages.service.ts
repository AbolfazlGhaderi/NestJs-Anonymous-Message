import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message..entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagerepository: Repository<MessageEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findAllMessage(userSlug : string) {

   return await this.usersService.findUserBySlug(userSlug)
  }
}

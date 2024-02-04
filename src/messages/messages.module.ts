import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message..entity';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MessageEntity,UserEntity])],
  controllers: [MessagesController],
  providers: [MessagesService,UsersService],
})
export class MessagesModule {}

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message..entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findAllMessage(userEmail: string) {
    
    //---------------- User Search in the DB ------------------------------

    const user = await this.usersService.findUserByEmail(userEmail);

    if (!user) throw new HttpException('User not Find', 404);

    // ------------------ get messages in the DB --------------------------

    const messages = await this.messageRepository.find({

      where: { user: { id: user.id } },

    });

    if (!messages[0]) throw new HttpException('no message find', 404);

    return messages;
  }
}

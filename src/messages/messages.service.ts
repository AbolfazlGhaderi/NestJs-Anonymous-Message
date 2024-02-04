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

  async findAllMessage(userSlug: string) {
    //---------------- User Search in the DB ------------------------------

    const user = await this.usersService.findUserBySlug(userSlug);

    if (!user) throw new HttpException('User not Find', 404);

    // ------------------ get messages in the DB --------------------------

    // const messages = await this.messageRepository.findBy({user:user});
    // const messages = await this.messageRepository
    // .createQueryBuilder("message")
    // .getMany()
    const userid = user.id;
    const messages = await this.messageRepository.find({
      relations: { user: true },
      where: { user: { id :user.id} },
    });

    if (!messages[0]) throw new HttpException('no message find', 404);

    return messages;
  }
}

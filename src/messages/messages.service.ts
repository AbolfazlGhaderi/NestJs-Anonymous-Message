import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message..entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateMessageDTO } from './dto/create.message.dto';

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

    if (!user) throw new HttpException('User not found', 404);

    // ------------------ get messages in the DB --------------------------

    const messages = await this.messageRepository.find({
      where: { user: { id: user.id } },
    });

    if (!messages[0]) throw new HttpException('Message not found', 404);

    return messages;
  }

  //---------------------- Delete a message ----------------------

  async deleteOne(id: number) {
    const deleteR = await this.messageRepository.delete({ id: id });
    if (deleteR.affected === 0)
      throw new HttpException('Message not found', 404);

    return { message: 'The message was successfully deleted' };
  }

  //---------------------- Delete messages ----------------------

  async deleteAll(email: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) throw new HttpException('user not found ', 404);

    const deleteR = await this.messageRepository.delete({ user: user });

    if (deleteR.affected === 0)
      throw new HttpException('Message not found', 404);

    return { message: 'Messages deleted successfully' };
  }

  //----------------------- Check User To Send Message -----------------

  async checkUser(slug: string) {
    const result = await this.usersService.findUserBySlug(slug);

    return {
      displayName: result.displayName,
    };
  }

  //----------------------- Create Message -----------------------------

  async createMessage(data: CreateMessageDTO) {
    const User = await this.usersService.findUserBySlug(data.slug);
    if (!User?.id) return User;

    const result = await this.messageRepository.save({
      text: data.text,
      user: { id: User.id },
    });

    if (!result) throw new HttpException('internal server error', 500);

    return {
      message: 'Message saved successfully',
    };
  }
}

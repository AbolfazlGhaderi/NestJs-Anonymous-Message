import {
  HttpException,
  HttpVersionNotSupportedException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserUpdateDTO } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  //--------------------- find All ------------------------------

  findAll() {
    return this.userRepository.find();
  }

  //--------------------- Find User By Email --------------------

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  //--------------------- Check slug ----------------------------

  async checkSlug(slug: string) {
    const user = await this.userRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (user) throw new HttpException('Not available', 400);

    return { message: 'available' };
  }

  //--------------------- Create  -------------------------------

  async create(userData: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      return await this.userRepository.save({
        email: userData.email,
        displayName: userData.displayName,
        slug: userData.slug,
      });
    } else return user;
  }

  //--------------------- Update  -------------------------------

  async update(updateData: UserUpdateDTO, email: string) {
    // --------------------- user Search in the db --------------------------

    const user = await this.findUserByEmail(email);

    if (!user) throw new HttpException('user not find', 404);

    // --------------------- Check the changes ------------------------------

    if (
      user.slug !== updateData.slug ||
      user.displayName !== updateData.displayName
    ) {
      try {
        user.slug = updateData.slug;
        user.displayName = updateData.displayName;

        await this.userRepository.save(user);
        return { message: 'The update was done successfully' };

      } catch (err) {

        throw new HttpException(err.message, 500);

      }
    } else {

      return { message: 'ohhh noooo' };

    }
  }
}

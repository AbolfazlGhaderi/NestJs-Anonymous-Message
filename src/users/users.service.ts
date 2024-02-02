import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  findAll() {
    return this.userRepository.find();
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

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
}

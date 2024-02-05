import { HttpException, Injectable } from '@nestjs/common';
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

  async update(updateData: UserUpdateDTO, id: number) {
    
    // --------------------- user Search in the db --------------------------

    const user = await this.userRepository.findOne({
      where: { id: id.toString() },
    });

    if (!user) throw new HttpException('user not find', 404);

    // --------------------- Check the changes ------------------------------

    if (
      user.slug !== updateData.slug || user.displayName !== updateData.displayName
    ) {

      try {

        user.slug = updateData.slug;
        user.displayName = updateData.displayName;

        return await this.userRepository.save(user)

        
      } catch (err) {

        throw new HttpException(err.message, 500);

      }
    }
    else{

      return user
    }
  }
}

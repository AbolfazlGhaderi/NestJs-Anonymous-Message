import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports:[JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '2d' },
  }),TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,UsersService],
})
export class AuthModule {}

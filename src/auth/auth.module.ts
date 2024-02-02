import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { OtpCodeEntity } from './entitys/otpcode.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'Myst3r!ousC0d3_@S3cr3tP@ssw0rd',
      signOptions: { expiresIn: '2d' },
    }),
    TypeOrmModule.forFeature([UserEntity, OtpCodeEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService],
})
export class AuthModule {}

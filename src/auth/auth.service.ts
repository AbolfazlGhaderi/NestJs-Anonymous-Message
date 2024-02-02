import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as emailjs from '@emailjs/nodejs';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    
  ) {}

  async login(loginData: LoginDTO) {
    if (!loginData.code) {
      //-------------- Generete  otpCode ----------------------

      const otpCode = (
        Math.floor(Math.random() * (99999 - 10000)) + 10000
      ).toString();

      //-------------- templateParams to send ------------------

      const templateParams = {
        user_email: loginData.email,
        message: otpCode,
      };
      //-------------- Send otpCode ----------------------------

      return await emailjs
        .send(
          process.env.EMAIL_SERVICEID,
          process.env.EMAIL_TEMPLATEID,
          templateParams,
          {
            publicKey: process.env.EMAIL_PUBLICKEY,
            privateKey: process.env.EMAIL_PRIVATEKEY,
          },
        )
        .then( async (response) => {
          console.log(
            `SUCCESS! Sent to :  ${templateParams.user_email} | ${templateParams.message}`,
            response.status,
            response.text,
          );

        //-------------- Save otpCode in the DB ------------------



          
        })
        .catch((err) => {
          console.log(err);
          throw new HttpException('Error Send Email', 400);
        });
    }
  }
}

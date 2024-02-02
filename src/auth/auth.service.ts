import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as emailjs from '@emailjs/nodejs';
import { OtpCodeEntity } from './entitys/otpcode.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(OtpCodeEntity)
    private readonly otpCodeRepository: Repository<OtpCodeEntity>,
  ) {}

  async login(loginData: LoginDTO) {
    if (!loginData.code) {
      //-------------- Generete  otpCode ----------------------

      const otpCodeDB = await this.otpCodeRepository.find({
        where: {
          email: loginData.email,
          is_used: false,
        },
      });

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
        .then(async (response) => {
          console.log(
            `SUCCESS! Sent to :  ${templateParams.user_email} | ${templateParams.message}`,
            response.status,
            response.text,
          );
          //-------------- Save otpCode in the DB ------------------

          let savedOtpCode: object;

          if (!otpCodeDB[0]) {
            savedOtpCode = await this.otpCodeRepository.save({
              email: loginData.email,
              code: otpCode,
            });
          } else {
            otpCodeDB[0].code = otpCode;
            savedOtpCode = await this.otpCodeRepository.save([...otpCodeDB]);
          }
          //-------------- handle errors ---------------------------

          if (!savedOtpCode) throw new HttpException('Error Save Code', 500);

          // ------------- Return Message ----------------------------------

          return {
            message: 'Email sent successfully',
            email: loginData.email,
          };
        })
        .catch((err) => {
          console.log(err);

          throw new HttpException('Error Send Email', 500);
        });
    } else {
      //---------------- Search code in the DB -----------------------

      const resultSearchOtpCode = await this.otpCodeRepository.findOne({
        where: {
          email: loginData.email,
          code: loginData.code,
          is_used: false,
        },
      });
      // ---------------  handle errors  -----------------------------------

      if (!resultSearchOtpCode) throw new HttpException('Wrong Code', 404);

      // ---------------  Update OtpCode (is_used) -------------------------

      resultSearchOtpCode.is_used = true;
      await this.otpCodeRepository.save(resultSearchOtpCode);

      //---------------  Save User -----------------------------------------

      const slug = uuidv4();
      const displayName = loginData.email.split('@', 1);

      const user = await this.usersService.create({
        email: loginData.email,
        displayName: displayName[0],
        slug: slug,
      });

      // ---------------  handle errors  -----------------------------------

      if (!user) throw new HttpException('Error Save User', 500);

      //----------------  create access token -------------------------------

      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });

      //----------------  return ---------------------------------------------

      return {
        statusCode: 200,
        accessToken: accessToken,
      };
    }
  }
}

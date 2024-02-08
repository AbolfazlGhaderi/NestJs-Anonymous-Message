import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cors

  app.enableCors({ origin: '*' });

  //middlewares

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // validation

  app.useGlobalPipes(new ValidationPipe());

  // swagger

  const config = new DocumentBuilder()
    .setTitle('NestJs Anonymous Message ')
    .setDescription(
      'A Project to send and receive messages anonymously , built using NestJS',
    )
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  // server
  await app.listen(4000);
}
bootstrap();

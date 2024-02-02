import { Injectable, Logger, NestMiddleware, UseGuards } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard.guard';

@Injectable()

export class loggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, baseUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startAt = process.hrtime();
    
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const dif = process.hrtime(startAt);
      const responseTime = dif[0] * 1e3 + dif[1] * 1e-6;
      this.logger.log(
        `${method} | ${baseUrl} | ${statusCode} | ${contentLength} - ${userAgent} | ${ip} | ${responseTime.toFixed(2)}ms`,
      );
    });

    next();
  }
}

import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  private readonly logger = new LoggerService();

  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, this.saltRounds);
  }

  async comparePassword(options: {
    password: string;
    hashedPassword: string;
  }): Promise<boolean> {
    const { password, hashedPassword } = options;
    return bcryptjs.compare(password, hashedPassword);
  }

  validateToken(token: string) {
    try {
      const secretKeyJwt = this.configService.get<string>(
        'JWT_SECRET',
      ) as string;
      return jwt.verify(token, secretKeyJwt);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('valid token', e.message);
        throw e;
      }
      return null;
    }
  }

  generateAccessToken(payload: Pick<User, 'idUser'>) {
    const secretKeyJwt = this.configService.get<string>('JWT_SECRET') as string;
    return jwt.sign(payload, secretKeyJwt, { expiresIn: '1h' });
  }

  generateRefreshToken(payload: Pick<User, 'idUser'>) {
    const secretRefreshKeyJwt = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
    ) as string;
    return jwt.sign(payload, secretRefreshKeyJwt, { expiresIn: '7d' });
  }
}

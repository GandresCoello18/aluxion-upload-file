import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

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
}

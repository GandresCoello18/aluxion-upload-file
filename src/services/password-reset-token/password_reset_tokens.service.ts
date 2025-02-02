import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from './password_reset_tokens.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async findOneByUserId(options: { userId: string }) {
    return await this.passwordResetTokenRepository.findOne({
      where: { userId: options.userId },
    });
  }

  async findOneById(options: { idResetToken: string }) {
    return await this.passwordResetTokenRepository.findOne({
      where: { idResetToken: options.idResetToken },
    });
  }

  async findOneByToken(options: { token: string }) {
    return await this.passwordResetTokenRepository.findOne({
      where: { token: options.token },
    });
  }

  async createResetToken(reset: PasswordResetToken) {
    return await this.passwordResetTokenRepository.save(reset);
  }
}

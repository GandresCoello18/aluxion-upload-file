import { forwardRef, Module } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { PasswordResetTokenService } from './password_reset_tokens.service';
import { PasswordResetTokenController } from './password-reset-token.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './password_reset_tokens.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetToken]),
    forwardRef(() => UsersModule),
  ],
  providers: [PasswordResetTokenService, MailService],
  controllers: [PasswordResetTokenController],
  exports: [PasswordResetTokenService, TypeOrmModule],
})
export class PasswordResetTokenModule {}

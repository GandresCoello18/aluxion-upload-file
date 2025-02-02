import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { MailService } from '../../mail/mail.service';
import { PasswordResetTokenService } from '../password-reset-token/password_reset_tokens.service';
import { PasswordResetTokenModule } from '../password-reset-token/password_reset_tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    forwardRef(() => PasswordResetTokenModule),
  ],
  providers: [UsersService, MailService, PasswordResetTokenService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

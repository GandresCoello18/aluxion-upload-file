import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './services/files/files.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerConfigModule } from './config/throttler-config.module';
import { UsersModule } from './services/users/users.module';
import { MailModule } from './mail/mail.module';
import { PasswordResetTokenModule } from './services/password-reset-token/password_reset_tokens.module';
import { UnsplashModule } from './services/unsplash/unsplash.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerConfigModule,
    DatabaseModule,
    FilesModule,
    UsersModule,
    MailModule,
    PasswordResetTokenModule,
    UnsplashModule,
  ],
})
export class AppModule {}

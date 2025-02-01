import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerConfigModule } from './config/throttler-config.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerConfigModule,
    DatabaseModule,
    FilesModule,
    UsersModule,
  ],
})
export class AppModule {}

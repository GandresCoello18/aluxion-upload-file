import { Module } from '@nestjs/common';
import { FileUploadController } from './files.controller';
import { FileUploadService } from './files.service';
import { LoggerService } from '../../shared/logger/logger.service';
import { ConfigModule } from '@nestjs/config';
// import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, LoggerService],
})
export class FilesModule {}

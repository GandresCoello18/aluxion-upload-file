import { Module } from '@nestjs/common';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './files.controller';
import { FileUploadService } from './files.service';
import { LoggerService } from 'src/shared/logger/logger.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService, LoggerService],
})
export class FilesModule {}

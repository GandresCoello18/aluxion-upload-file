import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './files.service';
import { LoggerService } from 'src/shared/logger/logger.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly logger: LoggerService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      this.logger.log('File uploaded successfully');
      return this.fileUploadService.handleFileUpload(file);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('Error during file upload', e.message);
        throw e;
      }
    }
  }

  @Get('status')
  getStatus() {
    this.logger.log('GET /file-upload/status requested');
    return { message: 'File Upload API is running smoothly' };
  }
}

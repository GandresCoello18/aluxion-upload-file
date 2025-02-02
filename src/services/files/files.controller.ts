import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  Body,
  BadRequestException,
  // UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './files.service';
import { LoggerService } from 'src/shared/logger/logger.service';
import { UploadFromUnsplashDto } from './dto/upload-from-unsplash.dto';
import { isValidUrl } from 'src/shared/helpers/validation.helper';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/update-file.dto';
// import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SUCCESS_UPLOAD_FILE_AWS } from './files.swagger';
import { FAIL_TOKEN_NOT_FOUND_USER } from '../users/user.swagger';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly logger: LoggerService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Sube un archivo a S3' })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido exitosamente',
    schema: {
      example: SUCCESS_UPLOAD_FILE_AWS,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token no encontrado',
    schema: {
      example: FAIL_TOKEN_NOT_FOUND_USER,
    },
  })
  @ApiBody({
    type: UploadFileDto,
    description: 'Archivo a subir',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Archivo obtenido correctamente',
    schema: {
      example: {
        url: 'https://s3.amazonaws.com/bucket/file.png',
        filename: 'file.png',
      },
    },
  })
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const responseUploadFileS3 =
      await this.fileUploadService.uploadS3File(file);
    this.logger.log('File uploaded successfully');
    return responseUploadFileS3;
  }

  @Post('upload-from-unsplash')
  @ApiOperation({ summary: 'Subir imagen de url a S3' })
  @ApiResponse({
    status: 201,
    description: 'Imagen subido exitosamente',
    schema: {
      example: SUCCESS_UPLOAD_FILE_AWS,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token no encontrado',
    schema: {
      example: FAIL_TOKEN_NOT_FOUND_USER,
    },
  })
  @ApiBody({
    type: UploadFromUnsplashDto,
    description: 'Imagen URL a subir',
  })
  @ApiConsumes('application/json')
  // @UseGuards(JwtAuthGuard)
  async uploadFromUnsplash(
    @Body() uploadFromUnsplashDto: UploadFromUnsplashDto,
  ) {
    if (!isValidUrl(uploadFromUnsplashDto.imageUrl)) {
      throw new BadRequestException('Invalid image URL');
    }

    const result = await this.fileUploadService.uploadImageFromUnsplash(
      uploadFromUnsplashDto,
    );
    return { success: true, data: result };
  }

  @Get('download/s3/:key')
  //@UseGuards(JwtAuthGuard)
  async downloadFileS3(@Param('key') key: string, @Res() res: Response) {
    const fileContent = await this.fileUploadService.downloadFileFromS3(key);

    if (Buffer.isBuffer(fileContent)) {
      res.send(fileContent);
    }

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${key}"`,
    });

    res.send(fileContent);
  }

  @Get('public-url/:key')
  //@UseGuards(JwtAuthGuard)
  getPublicUrl(@Param('key') key: string) {
    const url = this.fileUploadService.getPublicUrl(key);
    return { url };
  }

  @Post('rename')
  //@UseGuards(JwtAuthGuard)
  async renameFile(
    @Body('oldKey') oldKey: string,
    @Body('newKey') newKey: string,
  ) {
    await this.fileUploadService.renameFile(oldKey, newKey);
    return { message: 'File renamed successfully' };
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/shared/logger/logger.service';
import { UploadFromUnsplashDto } from './dto/upload-from-unsplash.dto';
import axios from 'axios';

@Injectable()
export class FileUploadService {
  private s3: AWS.S3;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_REGION') as string,
      accessKeyId: this.configService.get<string>(
        'AWS_ACCESS_KEY_ID',
      ) as string,
      secretAccessKey: this.configService.get<string>(
        'AWS_SECRET_ACCESS_KEY',
      ) as string,
    });
  }

  async uploadS3File(file: Express.Multer.File) {
    const { originalname, buffer, mimetype } = file;

    return (await this.s3_upload({
      file: buffer,
      name: originalname,
      mimetype,
    })) as object;
  }

  async s3_upload(options: {
    file: Buffer<ArrayBufferLike>;
    name: string;
    mimetype: string;
  }) {
    const { file, name, mimetype } = options;
    const params = {
      Bucket: this.configService.get<string>('BUCKET_AWS') as string,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      return await this.s3.upload(params).promise();
    } catch (e) {
      console.log(e);
    }
  }

  async downloadFileFromS3(key: string) {
    const params = {
      Bucket: this.configService.get<string>('BUCKET_AWS') as string,
      Key: key,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      return data.Body;
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('Error during file download', e.message);
      }
      throw new BadRequestException('File download from S3 failed');
    }
  }

  getPublicUrl(key: string) {
    const bucket = this.configService.get<string>('BUCKET_AWS') as string;
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  async renameFile(oldKey: string, newKey: string) {
    try {
      const copyParams = {
        Bucket: this.configService.get<string>('BUCKET_AWS') as string,
        CopySource: `${this.configService.get<string>('BUCKET_AWS') as string}/${oldKey}`,
        Key: newKey,
      };

      await this.s3.copyObject(copyParams).promise();

      const deleteParams = {
        Bucket: this.configService.get<string>('BUCKET_AWS') as string,
        Key: oldKey,
      };

      await this.s3.deleteObject(deleteParams).promise();
    } catch (e) {
      console.error('Error al renombrar el archivo:', e);
      throw new BadRequestException('Error al renombrar el archivo');
    }
  }

  async uploadImageFromUnsplash(uploadFromUnsplashDto: UploadFromUnsplashDto) {
    try {
      const { imageUrl, filename } = uploadFromUnsplashDto;
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const mimetype = await this.getMimeType(imageUrl);
      const imageBuffer = Buffer.from(
        response.data as WithImplicitCoercion<string>,
        'binary',
      );

      return await this.s3_upload({
        file: imageBuffer,
        name: filename,
        mimetype: mimetype || 'image/jpg',
      });
    } catch (error) {
      throw new BadRequestException(
        'Error during image download or upload ' + error.message,
      );
    }
  }

  async getMimeType(url: string): Promise<string | null> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.headers.get('Content-Type') || null;
    } catch (error) {
      console.error('Error fetching MIME type:', error);
      return null;
    }
  }
}

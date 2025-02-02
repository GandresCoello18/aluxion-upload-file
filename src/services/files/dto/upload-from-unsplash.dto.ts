import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadFromUnsplashDto {
  @ApiProperty({
    type: 'string',
    description: 'Imagen url',
  })
  @IsString()
  readonly imageUrl: string;

  @ApiProperty({
    type: 'string',
    description: 'Nombre de la imagen',
  })
  @IsString()
  readonly filename: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RenameFileUploadDto {
  @ApiProperty({
    type: 'string',
    description: 'Nombre actual',
  })
  @IsString()
  readonly oldKey: string;

  @ApiProperty({
    type: 'string',
    description: 'Nuevo nombre',
  })
  @IsString()
  readonly newKey: string;
}

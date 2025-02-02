import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { EnumGenderUser } from '../user.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'Andres',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'string',
    example: 'Coello',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    type: 'string',
    example: 'goyeselcoca@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: 'string',
    example: 'mi-clave-secreta',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    enum: EnumGenderUser,
    example: 'man',
    required: false,
  })
  @IsOptional()
  @IsEnum(EnumGenderUser)
  gender?: EnumGenderUser | null;
}

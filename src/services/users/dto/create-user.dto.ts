import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumGenderUser } from '../user.model';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'Andres',
    minLength: 4,
    maxLength: 50,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  readonly name: string;

  @ApiProperty({
    type: 'string',
    example: 'Coello',
    minLength: 4,
    maxLength: 50,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(50, { message: 'Last name must be at most 50 characters long' })
  readonly lastName: string;

  @ApiProperty({
    type: 'string',
    example: 'goyeselcoca@gmail.com',
    maxLength: 150,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(150, { message: 'Email must be at most 150 characters long' })
  readonly email: string;

  @ApiProperty({
    type: 'string',
    example: 'mi-clave-secreta',
    maxLength: 150,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(150, { message: 'Password must be at most 150 characters long' })
  readonly password: string;

  @ApiProperty({
    type: 'string',
    enum: EnumGenderUser,
    example: 'man',
  })
  @IsEnum(EnumGenderUser)
  readonly gender: EnumGenderUser | null;
}

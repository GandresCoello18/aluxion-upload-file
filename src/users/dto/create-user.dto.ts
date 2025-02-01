// src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { EnumGenderUser } from '../user.model';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  readonly name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(50, { message: 'Last name must be at most 50 characters long' })
  readonly lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(150, { message: 'Email must be at most 150 characters long' })
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(150, { message: 'Password must be at most 150 characters long' })
  readonly password: string;

  @IsEnum(EnumGenderUser)
  readonly gender: EnumGenderUser | null;
}

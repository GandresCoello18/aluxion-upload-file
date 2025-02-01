// src/users/dto/create-user.dto.ts
import { IsString, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsString()
  readonly password: string;
}

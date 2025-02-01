import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { EnumGenderUser } from '../user.model';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(EnumGenderUser)
  gender?: EnumGenderUser | null;
}

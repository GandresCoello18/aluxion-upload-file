import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordUserDto {
  @ApiProperty({
    type: 'string',
    example: '3e427c789e..........',
    maxLength: 150,
  })
  @IsString({})
  @MaxLength(150, { message: 'Email must be at most 150 characters long' })
  readonly token: string;

  @ApiProperty({
    type: 'string',
    example: 'mi-clave-secreta-update',
    maxLength: 150,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(150, { message: 'Password must be at most 150 characters long' })
  readonly newPassword: string;
}

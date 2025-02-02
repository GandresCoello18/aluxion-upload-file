import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    type: 'string',
    example: 'goyeselcoca@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({
    type: 'string',
    example: 'mi-clave-secreta',
  })
  @IsString()
  readonly password: string;
}

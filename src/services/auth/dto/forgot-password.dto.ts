import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AuthForgotPasswordDto {
  @ApiProperty({
    type: 'string',
    example: 'goyeselcoca@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;
}

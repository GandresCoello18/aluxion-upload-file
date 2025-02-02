import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { PasswordResetTokenService } from './password_reset_tokens.service';
import { MailService } from '../../mail/mail.service';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  FORGOT_PASSWORD_RESPONSE_INVALID,
  FORGOT_PASSWORD_RESPONSE_SUCCESS,
} from './password.swagger';

@Controller('forgot-password')
export class PasswordResetTokenController {
  constructor(
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Recuperar contraseña' })
  @ApiResponse({
    status: 201,
    description: 'Contraseña recuperada',
    schema: {
      example: FORGOT_PASSWORD_RESPONSE_SUCCESS,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Contraseña no recuperada',
    schema: {
      example: FORGOT_PASSWORD_RESPONSE_INVALID,
    },
  })
  @ApiBody({
    type: AuthForgotPasswordDto,
    description: 'Valores a recibir en el body',
  })
  @ApiConsumes('application/json')
  async forgotPassword(@Body() authForgotPasswordDto: AuthForgotPasswordDto) {
    const { email } = authForgotPasswordDto;

    const existingUser = await this.usersService.findOneByEmail({ email });

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    await this.passwordResetTokenService.createResetToken({
      idResetToken: uuidv4(),
      token,
      expiresAt: expirationTime,
      userId: existingUser.idUser,
      user: existingUser,
    });

    const emailHtml = await this.mailService.generateEmail({
      template: 'forgot-password',
      variables: { token },
    });
    await this.mailService.sendEmail({
      to: email,
      subject: 'Reset password',
      text: '-',
      html: emailHtml,
    });

    return {
      message: 'Email sent successfully',
    };
  }
}

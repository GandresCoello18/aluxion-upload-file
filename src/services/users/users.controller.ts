import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Request,
  BadRequestException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { validGenderUser } from '../../shared/helpers/user.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { MailService } from '../../mail/mail.service';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { PasswordResetTokenService } from '../password-reset-token/password_reset_tokens.service';
import {
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';
import {
  FAIL_RESET_PASSWORD_USER,
  FAIL_RESPONSE_REGISTER_USER,
  FAIL_TOKEN_NOT_FOUND_USER,
  SUCCESS_GET_ME_USER,
  SUCCESS_REMOVE_USER,
  SUCCESS_RESET_PASSWORD_USER,
  SUCCESS_RESPONSE_REGISTER_USER,
  SUCCESS_UPDATE_USER,
} from './user.swagger';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado con éxito',
    schema: {
      example: SUCCESS_RESPONSE_REGISTER_USER,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario ya existe',
    schema: {
      example: FAIL_RESPONSE_REGISTER_USER,
    },
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Valores a recibir en el body',
  })
  @ApiConsumes('application/json')
  async create(@Body() createUserDto: CreateUserDto) {
    const { gender } = createUserDto;

    if (gender && !validGenderUser({ gender })) {
      throw new BadRequestException('Gender is not valid');
    }

    const existingUser = await this.usersRepository.count({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.usersService.createUser({
      idUser: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordResetTokens: [],
      ...createUserDto,
    });

    const emailHtml = await this.mailService.generateEmail({
      template: 'welcome',
      variables: {
        name: createUserDto.name,
      },
    });
    await this.mailService.sendEmail({
      to: createUserDto.email,
      subject: 'Registration successful',
      text: '-',
      html: emailHtml,
    });

    return { message: 'User created successfully', user: newUser };
  }

  @Patch('/reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña' })
  @ApiOkResponse({
    description: 'Contraseña restablecida con éxito',
    schema: {
      example: SUCCESS_RESET_PASSWORD_USER,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o expirado',
    schema: {
      example: FAIL_RESET_PASSWORD_USER,
    },
  })
  @ApiBody({
    type: UpdatePasswordUserDto,
    description: 'Valores a recibir en el body',
  })
  @ApiConsumes('application/json')
  async updatePassword(@Body() updatePasswordUserDto: UpdatePasswordUserDto) {
    const { token, newPassword } = updatePasswordUserDto;
    const resetToken = await this.passwordResetTokenService.findOneByToken({
      token,
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired token');
    }

    const currentDate = new Date();
    if (resetToken.expiresAt < currentDate) {
      throw new BadRequestException('Token has expired');
    }

    const user = await this.usersService.findOneById(resetToken.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.usersService.update(resetToken.userId, {
      password: newPassword,
    });

    const emailHtml = await this.mailService.generateEmail({
      template: 'update-password-success',
      variables: {},
    });
    await this.mailService.sendEmail({
      to: user.email,
      subject: 'Password updated successfully',
      text: '-',
      html: emailHtml,
    });

    return { message: 'Password updated successfully' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener información mi usuario' })
  @ApiOkResponse({
    description: 'Información del usuario obtenida con éxito',
    schema: {
      example: SUCCESS_GET_ME_USER,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o expirado',
    schema: {
      example: FAIL_TOKEN_NOT_FOUND_USER,
    },
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access token',
  })
  @ApiConsumes('application/json')
  @UseGuards(JwtAuthGuard)
  findMe(@Request() req) {
    const user = req.user as User;
    return user;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Actualizar información mi usuario' })
  @ApiOkResponse({
    description: 'Información del usuario actualizada con éxito',
    schema: {
      example: SUCCESS_UPDATE_USER,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o expirado',
    schema: {
      example: FAIL_TOKEN_NOT_FOUND_USER,
    },
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access token',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Valores a recibir en el body',
  })
  @ApiConsumes('application/json')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user as User;
    if (!updateUserDto || !Object.values(updateUserDto).length) {
      throw new BadRequestException('No fields to update');
    }
    const updatedUser = await this.usersService.update(
      user.idUser,
      updateUserDto,
    );

    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @Delete('me')
  @ApiOperation({ summary: 'Eliminar información mi usuario' })
  @ApiOkResponse({
    description: 'Información del usuario eliminada con éxito',
    schema: {
      example: SUCCESS_REMOVE_USER,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o expirado',
    schema: {
      example: FAIL_TOKEN_NOT_FOUND_USER,
    },
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access token',
  })
  @ApiConsumes('application/json')
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req) {
    const user = req.user as User;
    await this.usersService.delete(user.idUser);
    return { message: 'User deleted successfully' };
  }
}

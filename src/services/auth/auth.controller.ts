import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/services/users/users.service';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  AUTH_RESPONSE_INVALID_CREDENTIALS,
  AUTH_RESPONSE_SUCCESS_LOGIN,
} from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 201,
    description: 'Token de acceso generado',
    schema: {
      example: AUTH_RESPONSE_SUCCESS_LOGIN,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error al iniciar sesión',
    schema: {
      example: AUTH_RESPONSE_INVALID_CREDENTIALS,
    },
  })
  @ApiBody({
    type: AuthLoginDto,
    description: 'Valores a recibir en el body',
  })
  @ApiConsumes('application/json')
  async login(@Body() authLoginDto: AuthLoginDto) {
    const { email, password } = authLoginDto;

    const existingUser = await this.usersService.findOneByEmail({ email });

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await this.authService.comparePassword({
      password,
      hashedPassword: existingUser.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    existingUser.password = '';
    const token = this.authService.generateAccessToken({
      idUser: existingUser.idUser,
    });
    const refreshToken = this.authService.generateRefreshToken({
      idUser: existingUser.idUser,
    });

    return {
      message: 'Login successful',
      user: {
        me: existingUser,
        token,
        refreshToken,
      },
    };
  }
}

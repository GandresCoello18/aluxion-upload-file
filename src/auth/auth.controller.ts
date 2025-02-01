import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('test')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post('login')
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
      throw new BadRequestException('Invalid password');
    }

    return {
      message: 'Login successful',
      user: {
        me: existingUser,
      },
    };
  }
}

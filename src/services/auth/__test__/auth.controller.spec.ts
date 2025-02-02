/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  const mockAuthService = {
    comparePassword: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    const authLoginDto: AuthLoginDto = {
      email: 'test@example.com',
      password: 'testPassword',
    };

    it('should throw BadRequestException if user is not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      await expect(authController.login(authLoginDto)).rejects.toThrow(
        new BadRequestException('User not found'),
      );
      expect(usersService.findOneByEmail).toHaveBeenCalledWith({
        email: authLoginDto.email,
      });
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const existingUser = { idUser: '123', password: 'hashedPassword' };
      mockUsersService.findOneByEmail.mockResolvedValue(existingUser);
      mockAuthService.comparePassword.mockResolvedValue(false);

      await expect(authController.login(authLoginDto)).rejects.toThrow(
        new BadRequestException('Invalid credentials'),
      );
      expect(authService.comparePassword).toHaveBeenCalledWith({
        password: authLoginDto.password,
        hashedPassword: existingUser.password,
      });
    });

    it('should return tokens and user data on successful login', async () => {
      const existingUser = { idUser: '123', password: 'hashedPassword' };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockUsersService.findOneByEmail.mockResolvedValue(existingUser);
      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.generateAccessToken.mockReturnValue(accessToken);
      mockAuthService.generateRefreshToken.mockReturnValue(refreshToken);

      const result = await authController.login(authLoginDto);

      expect(result).toEqual({
        message: 'Login successful',
        user: {
          me: { ...existingUser, password: '' },
          token: accessToken,
          refreshToken,
        },
      });

      expect(authService.generateAccessToken).toHaveBeenCalledWith({
        idUser: existingUser.idUser,
      });
      expect(authService.generateRefreshToken).toHaveBeenCalledWith({
        idUser: existingUser.idUser,
      });
    });
  });
});

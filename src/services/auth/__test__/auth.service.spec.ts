/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../../shared/logger/logger.service';

jest.mock('jsonwebtoken');
jest.mock('../../../shared/logger/logger.service');

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let loggerService: LoggerService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: new LoggerService() },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword';
      const hashedPassword = 'hashedPassword';

      const bcryptSpy = jest
        .spyOn(bcryptjs, 'hash')
        .mockResolvedValue(hashedPassword as never);

      const result = await authService.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcryptSpy).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('comparePassword', () => {
    it('should return true if password matches', async () => {
      const password = 'testPassword';
      const hashedPassword = 'hashedPassword';

      const bcryptSpy = jest
        .spyOn(bcryptjs, 'compare')
        .mockResolvedValue(true as never);

      const result = await authService.comparePassword({
        password,
        hashedPassword,
      });

      expect(result).toBe(true);
      expect(bcryptSpy).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return false if password does not match', async () => {
      const password = 'testPassword';
      const hashedPassword = 'hashedPassword';

      const bcryptSpy = jest
        .spyOn(bcryptjs, 'compare')
        .mockResolvedValue(false as never);

      const result = await authService.comparePassword({
        password,
        hashedPassword,
      });

      expect(result).toBe(false);
      expect(bcryptSpy).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', () => {
      const token = 'validToken';
      const decodedToken = { idUser: '123' };

      mockConfigService.get.mockReturnValue('jwtSecret');
      jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken as never);

      const result = authService.validateToken(token);

      expect(result).toEqual(decodedToken);
      expect(jwt.verify).toHaveBeenCalledWith(token, 'jwtSecret');
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const payload = { idUser: '123' };
      const accessToken = 'generatedAccessToken';

      mockConfigService.get.mockReturnValue('jwtSecret');
      jest.spyOn(jwt, 'sign').mockReturnValue(accessToken as never);

      const result = authService.generateAccessToken(payload);

      expect(result).toBe(accessToken);
      expect(jwt.sign).toHaveBeenCalledWith(payload, 'jwtSecret', {
        expiresIn: '1h',
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const payload = { idUser: '123' };
      const refreshToken = 'generatedRefreshToken';

      mockConfigService.get.mockReturnValue('jwtRefreshSecret');
      jest.spyOn(jwt, 'sign').mockReturnValue(refreshToken as never);

      const result = authService.generateRefreshToken(payload);

      expect(result).toBe(refreshToken);
      expect(jwt.sign).toHaveBeenCalledWith(payload, 'jwtRefreshSecret', {
        expiresIn: '7d',
      });
    });
  });
});

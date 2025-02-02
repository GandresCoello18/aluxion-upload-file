/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetTokenController } from '../password-reset-token.controller';
import { PasswordResetTokenService } from '../password_reset_tokens.service';
import { UsersService } from '../../users/users.service';
import { MailService } from '../../../mail/mail.service';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('PasswordResetTokenController', () => {
  let controller: PasswordResetTokenController;
  let passwordResetTokenService: PasswordResetTokenService;
  let usersService: UsersService;
  let mailService: MailService;

  const mockUser = {
    idUser: '123',
    email: 'test@example.com',
  };

  const mockToken = {
    idResetToken: uuidv4(),
    token: 'mock-token',
    expiresAt: new Date(),
    userId: mockUser.idUser,
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetTokenController],
      providers: [
        {
          provide: PasswordResetTokenService,
          useValue: {
            createResetToken: jest.fn().mockResolvedValue(mockToken),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: MailService,
          useValue: {
            generateEmail: jest.fn().mockResolvedValue('mock-email-html'),
            sendEmail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<PasswordResetTokenController>(
      PasswordResetTokenController,
    );
    passwordResetTokenService = module.get<PasswordResetTokenService>(
      PasswordResetTokenService,
    );
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('forgotPassword', () => {
    it('should successfully send an email for password reset', async () => {
      const authForgotPasswordDto = { email: 'test@example.com' };

      const result = await controller.forgotPassword(authForgotPasswordDto);

      expect(result).toEqual({
        message: 'Email sent successfully',
      });

      expect(usersService.findOneByEmail).toHaveBeenCalledWith({
        email: authForgotPasswordDto.email,
      });

      expect(passwordResetTokenService.createResetToken).toHaveBeenCalledWith({
        idResetToken: expect.any(String),
        token: expect.any(String),
        expiresAt: expect.any(Date),
        userId: mockUser.idUser,
        user: mockUser,
      });

      expect(mailService.generateEmail).toHaveBeenCalledWith({
        template: 'forgot-password',
        variables: { token: expect.any(String) },
      });

      expect(mailService.sendEmail).toHaveBeenCalledWith({
        to: authForgotPasswordDto.email,
        subject: 'Reset password',
        text: '-',
        html: 'mock-email-html',
      });
    });

    it('should throw a BadRequestException if user not found', async () => {
      const authForgotPasswordDto = { email: 'nonexistent@example.com' };

      usersService.findOneByEmail = jest.fn().mockResolvedValue(null);

      await expect(
        controller.forgotPassword(authForgotPasswordDto),
      ).rejects.toThrow(new BadRequestException('User not found'));
    });
  });
});

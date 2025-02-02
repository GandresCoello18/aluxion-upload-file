/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetTokenService } from '../password_reset_tokens.service';
import { PasswordResetToken } from '../password_reset_tokens.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PasswordResetTokenService', () => {
  let service: PasswordResetTokenService;
  let repository: Repository<PasswordResetToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetTokenService,
        {
          provide: getRepositoryToken(PasswordResetToken),
          useClass: Repository, // Mocking the Repository
        },
      ],
    }).compile();

    service = module.get<PasswordResetTokenService>(PasswordResetTokenService);
    repository = module.get<Repository<PasswordResetToken>>(
      getRepositoryToken(PasswordResetToken),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUserId', () => {
    it('should return a password reset token by user ID', async () => {
      const mockToken: any = {
        userId: '123',
        token: 'abc123',
        idResetToken: '456',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockToken);

      const result = await service.findOneByUserId({ userId: '123' });
      expect(result).toEqual(mockToken);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId: '123' },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a password reset token by ID', async () => {
      const mockToken: any = {
        userId: '123',
        token: 'abc123',
        idResetToken: '456',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockToken);

      const result = await service.findOneById({ idResetToken: '456' });
      expect(result).toEqual(mockToken);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { idResetToken: '456' },
      });
    });
  });

  describe('findOneByToken', () => {
    it('should return a password reset token by token', async () => {
      const mockToken: any = {
        userId: '123',
        token: 'abc123',
        idResetToken: '456',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockToken);

      const result = await service.findOneByToken({ token: 'abc123' });
      expect(result).toEqual(mockToken);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { token: 'abc123' },
      });
    });
  });

  describe('createResetToken', () => {
    it('should create a password reset token', async () => {
      const mockToken = new PasswordResetToken();
      mockToken.userId = '123';
      mockToken.token = 'abc123';
      mockToken.idResetToken = '456';

      jest.spyOn(repository, 'save').mockResolvedValue(mockToken);

      const result = await service.createResetToken(mockToken);
      expect(result).toEqual(mockToken);
      expect(repository.save).toHaveBeenCalledWith(mockToken);
    });
  });
});

/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { AuthService } from '../../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { EnumGenderUser } from '../user.model';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let authService: AuthService;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  };

  const mockAuthService = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { idUser: '1', email: 'test@example.com', createdAt: new Date() },
      ];
      mockUsersRepository.find.mockResolvedValue(users);

      const result = await usersService.findAll();
      expect(result).toEqual(users);
      expect(usersRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { idUser: '1', email: 'test@example.com' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await usersService.findOneByEmail({
        email: 'test@example.com',
      });
      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      const user = { idUser: '1', email: 'test@example.com' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await usersService.findOneById('1');
      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { idUser: '1' },
      });
    });
  });

  describe('createUser', () => {
    it('should create and return a new user with a hashed password', async () => {
      const hashedPassword = 'hashedPassword';
      const user = {
        idUser: '1',
        name: 'John Doe',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'plainPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: EnumGenderUser.MAN,
        passwordResetTokens: [],
      };
      const savedUser = { ...user, password: hashedPassword };

      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockUsersRepository.save.mockResolvedValue(savedUser);

      const result = await usersService.createUser(user);
      expect(result).toEqual({ ...savedUser, password: '' });
      expect(authService.hashPassword).toHaveBeenCalledWith(user.password);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...user,
        password: hashedPassword,
      });
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      mockUsersRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await usersService.delete('1');
      expect(result).toEqual({ affected: 1 });
      expect(usersRepository.delete).toHaveBeenCalledWith({ idUser: '1' });
    });
  });

  describe('update', () => {
    it('should throw an error if user is not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        usersService.update('1', {} as UpdateUserDto),
      ).rejects.toThrow('User not found');
    });

    it('should update and return the user with a hashed password', async () => {
      const existingUser = {
        idUser: '1',
        email: 'test@example.com',
        password: 'oldPassword',
      };
      const updateUserDto: UpdateUserDto = { password: 'newPassword' };
      const hashedPassword = 'hashedNewPassword';
      const updatedUser = {
        ...existingUser,
        ...updateUserDto,
        password: hashedPassword,
      };

      mockUsersRepository.findOne.mockResolvedValue(existingUser);
      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockUsersRepository.merge.mockReturnValue(updatedUser);
      mockUsersRepository.save.mockResolvedValue(updatedUser);

      const result = await usersService.update('1', updateUserDto);
      expect(result).toEqual({ ...updatedUser, password: '' });
      expect(usersRepository.merge).toHaveBeenCalledWith(existingUser, {
        ...updateUserDto,
        password: hashedPassword,
      });
      expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should update user without modifying password if not provided', async () => {
      const existingUser = {
        idUser: '1',
        email: 'test@example.com',
        password: 'oldPassword',
      };
      const updateUserDto: UpdateUserDto = { email: 'new@example.com' };
      const updatedUser = { ...existingUser, ...updateUserDto };

      mockUsersRepository.findOne.mockResolvedValue(existingUser);
      mockUsersRepository.merge.mockReturnValue(updatedUser);
      mockUsersRepository.save.mockResolvedValue(updatedUser);

      const result = await usersService.update('1', updateUserDto);
      expect(result).toEqual({ ...updatedUser, password: '' });
      expect(usersRepository.merge).toHaveBeenCalledWith(
        existingUser,
        updateUserDto,
      );
      expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
    });
  });
});

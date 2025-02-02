import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}
  async findAll() {
    return await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByEmail(options: { email: string }) {
    return await this.usersRepository.findOne({
      where: { email: options.email },
    });
  }

  async findOneById(idUser: string) {
    return await this.usersRepository.findOne({ where: { idUser } });
  }

  async createUser(user: User) {
    const hashedPassword = await this.authService.hashPassword(user.password);
    const newUser = await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });
    newUser.password = '';
    return newUser;
  }

  async delete(idUser: string) {
    return await this.usersRepository.delete({ idUser });
  }

  async update(idUser: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { idUser } });
    if (updateUserDto?.password) {
      const hashedPassword = await this.authService.hashPassword(
        updateUserDto.password,
      );
      updateUserDto.password = hashedPassword;
    }

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    const savedUser = await this.usersRepository.save(updatedUser);
    savedUser.password = '';
    return savedUser;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { validGenderUser } from 'src/shared/helpers/user.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':idUser')
  async findOne(@Param('idUser') idUser: string) {
    return this.usersService.findOneById(idUser);
  }

  @Post('register')
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
      ...createUserDto,
    });

    return { message: 'User created successfully', user: newUser };
  }

  @Put(':idUser')
  async update(
    @Param('idUser') idUser: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(idUser, updateUserDto);
  }

  @Delete(':idUser')
  async delete(@Param('idUser') idUser: string) {
    return this.usersService.delete(idUser);
  }
}

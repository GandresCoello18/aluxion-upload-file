import { BadRequestException, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/services/users/user.entity';
import { UsersService } from 'src/services/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'] || '';

    if (!token) throw new BadRequestException('Token not found');

    const { idUser } = this.authService.validateToken(token as string) as Pick<
      User,
      'idUser'
    >;
    if (!idUser) throw new BadRequestException('Invalid token');

    const user = await this.userService.findOneById(idUser);
    if (!user) throw new BadRequestException('User not found');

    user.password = '';
    request.user = user;

    return true;
  }
}

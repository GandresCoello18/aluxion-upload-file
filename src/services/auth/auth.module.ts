import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService, JwtAuthGuard, ConfigService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

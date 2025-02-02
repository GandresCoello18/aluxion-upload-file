import { Module } from '@nestjs/common';
import { UnsplashController } from './unsplash.controller';
import { UnsplashService } from './unsplash.service';

@Module({
  providers: [UnsplashService],
  controllers: [UnsplashController],
  exports: [UnsplashService],
})
export class UnsplashModule {}

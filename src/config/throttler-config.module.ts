import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: configService.get<number>('RATE_LIMIT_SHORT_TTL', 1000),
            limit: configService.get<number>('RATE_LIMIT_SHORT_LIMIT', 15),
          },
          {
            name: 'medium',
            ttl: configService.get<number>('RATE_LIMIT_MEDIUM_TTL', 10000),
            limit: configService.get<number>('RATE_LIMIT_MEDIUM_LIMIT', 50),
          },
          {
            name: 'long',
            ttl: configService.get<number>('RATE_LIMIT_LONG_TTL', 60000),
            limit: configService.get<number>('RATE_LIMIT_LONG_LIMIT', 100),
          },
        ],
      }),
    }),
  ],
})
export class ThrottlerConfigModule {}

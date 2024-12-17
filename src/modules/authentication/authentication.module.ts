import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthenticationController } from './authentication.controller.js';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy.js';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy.js';
import { HeaderApiKeyStrategy } from './strategy/auth-header-api-key.strategy.js';
import { JwtModule } from '@nestjs/jwt';
import Joi from '@hapi/joi';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    HeaderApiKeyStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

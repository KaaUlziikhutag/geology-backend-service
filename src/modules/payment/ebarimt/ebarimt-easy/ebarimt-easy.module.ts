import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EbarimtEasyService } from './ebarimt-easy.service.js';
import { EbarimtAuthModule } from '../ebarimt-auth/ebarimt-auth.module.js';
import Joi from '@hapi/joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EBARIMT_EASY_URL: Joi.string().required(),
      }),
    }),
    EbarimtAuthModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: config.get('EBARIMT_EASY_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EbarimtEasyService],
  exports: [EbarimtEasyService],
})
export class EbarimtEasyModule {}

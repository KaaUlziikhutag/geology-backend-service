import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EbarimtInfoService } from './ebarimt-info.service';
import Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EBARIMT_INFO_URL: Joi.string().required(),
      }),
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: config.get('EBARIMT_INFO_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EbarimtInfoService],
  exports: [EbarimtInfoService],
})
export class EbarimtInfoModule {}

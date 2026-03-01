import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EbarimtInquireService } from './ebarimt-inquire.service';
import Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EBARIMT_API_URL: Joi.string().required(),
      }),
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: config.get('EBARIMT_API_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EbarimtInquireService],
  exports: [EbarimtInquireService],
})
export class EbarimtInquireModule {}

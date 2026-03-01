import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EbarimtAuthService } from './ebarimt-auth.service';
import Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EBARIMT_AUTH_URL: Joi.string().required(),
        EBARIMT_USERNAME: Joi.string().required(),
        EBARIMT_PASSWORD: Joi.string().required(),
      }),
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  ],
  providers: [EbarimtAuthService],
  exports: [EbarimtAuthService],
})
export class EbarimtAuthModule {}

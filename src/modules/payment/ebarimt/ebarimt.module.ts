import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiLogModule } from '../../api-log/api-log.module';
import { EbarimtController } from './ebarimt.controller';
import { EbarimtService } from './ebarimt.service';
import Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EBARIMT_LOCAL_URL: Joi.string().required(),
      }),
    }),
    ApiLogModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.get('EBARIMT_LOCAL_URL'),
      }),
    }),
  ],
  controllers: [EbarimtController],
  providers: [EbarimtService],
  exports: [EbarimtService],
})
export class EbarimtModule {}

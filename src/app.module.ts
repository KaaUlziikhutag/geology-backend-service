import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { ReferenceModule } from './modules/reference/reference.module';
import { LocalFilesModule } from './modules/local-files/local-files.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ApiLogModule } from './modules/api-log/api-log.module';
import { EmailModule } from './modules/email/email.module';
import LogsMiddleware from './utils/middleware/logs.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './utils/cron.service';
import { AuthModule } from './modules/auth/auth.module';
import { HrModule } from './modules/hr/hr.module';
import { PosModule } from './modules/pos/pos.module';
import { LaboratoryModule } from './modules/laboratory/laboratory.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ApiLogModule,
    ReferenceModule,
    LocalFilesModule,
    DashboardModule,
    EmailModule,
    AuthModule,
    HrModule,
    PosModule,
    LaboratoryModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}

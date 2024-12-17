import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { fileURLToPath } from 'url';
import { DatabaseModule } from './database/database.module.js';
import { AdminBroModule } from './admin/admin.module.js';
import { ReferenceModule } from './modules/reference/reference.module.js';
import { CustomerModule } from './modules/customer/customer.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AuthenticationModule } from './modules/authentication/authentication.module.js';
import { LocalFilesModule } from './modules/local-files/local-files.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { AppointmentModule } from './modules/appointment/appointment.module.js';
import { ApiLogModule } from './modules/api-log/api-log.module.js';
import { PaymentModule } from './modules/payment/payment.module.js';
import { EmailModule } from './modules/email/email.module.js';
import LogsMiddleware from './utils/middleware/logs.middleware.js';
import { MineralModule } from './modules/appointment/mineral/mineral.module.js';
import { ReportModule } from './modules/report/report.module.js';
import { ProductModule } from './modules/product/product.module.js';
import { ContractModule } from './modules/contract/contract.module.js';
import { DecisionModule } from './modules/decision/decision.module.js';
import { PriceModule } from './modules/price/price.module.js';
import { OrderModule } from './modules/order/order.module.js';
import { NotificationModule } from './modules/notification/notification.module.js';
import { TaskModule } from './modules/task/task.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './utils/cron.service.js';
import { BarcodeModule } from './modules/barcode/barcode.module.js';
import { IndicatorModule } from './modules/indicator/indicator.module.js';
import { TestingResultModule } from './modules/testing-results/testing-result.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: fileURLToPath(new URL('../public', import.meta.url)),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AdminBroModule,
    ApiLogModule,
    ReferenceModule,
    CustomerModule,
    UsersModule,
    AuthenticationModule,
    LocalFilesModule,
    AppointmentModule,
    MineralModule,
    DashboardModule,
    PaymentModule,
    EmailModule,
    ReportModule,
    ProductModule,
    ContractModule,
    DecisionModule,
    PriceModule,
    OrderModule,
    NotificationModule,
    TaskModule,
    BarcodeModule,
    IndicatorModule,
    TestingResultModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { fileURLToPath } from 'url';
import { DatabaseModule } from './database/database.module';
import { ReferenceModule } from './modules/reference/reference.module';
import { CustomerModule } from './modules/customer/customer.module';
import { UsersModule } from './modules/users/users.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { LocalFilesModule } from './modules/local-files/local-files.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ApiLogModule } from './modules/api-log/api-log.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EmailModule } from './modules/email/email.module';
import LogsMiddleware from './utils/middleware/logs.middleware';
import { MineralModule } from './modules/appointment/mineral/mineral.module';
import { ReportModule } from './modules/report/report.module';
import { ProductModule } from './modules/product/product.module';
import { ContractModule } from './modules/contract/contract.module';
import { DecisionModule } from './modules/decision/decision.module';
import { PriceModule } from './modules/price/price.module';
import { OrderModule } from './modules/order/order.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TaskModule } from './modules/task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './utils/cron.service';
import { BarcodeModule } from './modules/barcode/barcode.module';
import { IndicatorModule } from './modules/indicator/indicator.module';
import { TestingResultModule } from './modules/testing-results/testing-result.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
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

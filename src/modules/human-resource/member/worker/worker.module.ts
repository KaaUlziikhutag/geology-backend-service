import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.contoller';
import Workers from './worker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LocalFilesModule } from '../../../local-files/local-files.module';
import WorkerApp from './entities/worker-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workers, WorkerApp]),
    ConfigModule,
    LocalFilesModule,
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}

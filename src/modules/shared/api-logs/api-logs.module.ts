import { Module } from '@nestjs/common';
import ApiLogsService from './api-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ApiLog from './api-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiLog])],
  providers: [ApiLogsService],
  exports: [ApiLogsService],
})
export class ApiLogsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ApiLog from './api-log.entity.js';
import { ApiLogService } from './api-log.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ApiLog])],
  providers: [ApiLogService],
  exports: [ApiLogService],
})
export class ApiLogModule {}

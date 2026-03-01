import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ApiLog from './api-log.entity';
import { Repository } from 'typeorm';
import CreateApiLogDto from './dto/create-api-log.dto';

@Injectable()
export class ApiLogService {
  constructor(
    @InjectRepository(ApiLog) private apiLogRepository: Repository<ApiLog>,
  ) {}

  async createApiLog(apiLog: CreateApiLogDto) {
    const newApiLog = this.apiLogRepository.create(apiLog);
    await this.apiLogRepository.save(newApiLog);
    return newApiLog;
  }
}

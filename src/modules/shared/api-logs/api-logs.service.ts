import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ApiLogs from './api-logs.entity';
import CreateApiLog from './dto/create-api-logs.dto';

@Injectable()
export default class ApiLogsService {
  constructor(
    @InjectRepository(ApiLogs)
    private apiLogsRepository: Repository<ApiLogs>,
  ) {}

  async createLog(apiLog: CreateApiLog) {
    const newApiLog = this.apiLogsRepository.create(apiLog);
    await this.apiLogsRepository.save(newApiLog);
    return newApiLog;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BarcodeService } from '../modules/barcode/barcode.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly barcodeService: BarcodeService) {}
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    try {
      await this.barcodeService.generateBarcode();
    } catch (error) {
      this.logger.error(error);
    }
  }
}

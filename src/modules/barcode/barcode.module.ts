import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barcode } from './barcode.entity.js';
import { BarcodeService } from './barcode.service.js';
import { BarcodeController } from './barcode.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Barcode])],
  providers: [BarcodeService],
  exports: [BarcodeService],
  controllers: [BarcodeController],
})
export class BarcodeModule {}

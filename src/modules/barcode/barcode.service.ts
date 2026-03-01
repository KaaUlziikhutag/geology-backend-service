import { Injectable } from '@nestjs/common';
import { Barcode } from './barcode.entity';
import { Repository } from 'typeorm';
import { generate } from 'generate-password';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BarcodeService {
  constructor(
    @InjectRepository(Barcode)
    private readonly barcodeRepository: Repository<Barcode>,
  ) {}

  async generateBarcode(): Promise<void> {
    let counter = 0;
    while (counter < 500) {
      const barcode = generate({
        length: 6,
        numbers: true,
        uppercase: true,
      });
      const count = await this.barcodeRepository.countBy({ barcode });
      if (count === 0) {
        const newBarcode = this.barcodeRepository.create({ barcode });
        await this.barcodeRepository.save(newBarcode);
        counter++;
      }
    }
  }
  async getCountBarcode(): Promise<number> {
    return await this.barcodeRepository.countBy({ isUsed: false });
  }
  async getBarcode(): Promise<Barcode> {
    return await this.barcodeRepository.findOneBy({ isUsed: false });
  }

  async updateBarcode(barcode: string): Promise<void> {
    await this.barcodeRepository.update({ barcode }, { isUsed: true });
  }
}

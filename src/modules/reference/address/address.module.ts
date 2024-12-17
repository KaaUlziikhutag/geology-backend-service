import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Province from './province.entity.js';
import District from './district.entity.js';
import { AddressService } from './address.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Province, District])],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}

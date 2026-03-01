import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Province from './province.entity';
import District from './district.entity';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Province, District])],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}

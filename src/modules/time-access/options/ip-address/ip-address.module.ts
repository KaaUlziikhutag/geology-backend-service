import { Module } from '@nestjs/common';
import { IpAddressService } from './ip-address.service';
import { IpAddressController } from './ip-address.contoller';
import IpAddress from './entity/ip-address.entity';
import IpAddressByusers from './entity/ip-byuser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([IpAddress, IpAddressByusers]),
    ConfigModule,
  ],
  controllers: [IpAddressController],
  providers: [IpAddressService],
  exports: [IpAddressService],
})
export class TimeIpAddressModule {}

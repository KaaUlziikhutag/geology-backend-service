import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './user-devices.server';
import { Device } from './user-devices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}

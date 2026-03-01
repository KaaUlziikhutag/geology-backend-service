import { Injectable } from '@nestjs/common';
import { Device } from './user-devices.entity'; // Adjust the import based on your file structure
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async createDevice(
    userId: number,
    deviceInfo: {
      deviceModel: string;
      osName: string;
      osVersion: string;
      type: string;
      device: string;
    },
  ): Promise<Device> {
    const device = this.deviceRepository.create({
      ...deviceInfo,
      user: { id: userId },
    });
    return await this.deviceRepository.save(device);
  }

  async findAllDevicesByUserId(userId: number): Promise<Device[]> {
    return await this.deviceRepository.find({
      where: { user: { id: userId } },
    });
  }
}

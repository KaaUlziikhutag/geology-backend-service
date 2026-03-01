import { Module } from '@nestjs/common';
import { AptitudeService } from './aptitudes.service';
import { AptitudeController } from './aptitudes.contoller';
import Aptitudes from './aptitudes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Aptitudes]), ConfigModule],
  controllers: [AptitudeController],
  providers: [AptitudeService],
  exports: [AptitudeService],
})
export class AptitudeModule {}

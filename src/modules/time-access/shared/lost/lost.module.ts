import { Module } from '@nestjs/common';
import { DirectLostService } from './lost.service';
import { DirectLostController } from './lost.contoller';
import DirectLosts from './lost.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([DirectLosts]), ConfigModule],
  controllers: [DirectLostController],
  providers: [DirectLostService],
  exports: [DirectLostService],
})
export class DirectLostModule {}

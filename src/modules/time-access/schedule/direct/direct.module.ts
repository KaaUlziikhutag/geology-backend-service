import { Module } from '@nestjs/common';
import { DirectService } from './direct.service';
import { DirectController } from './direct.contoller';
import Directs from './entities/direct.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Directs]), ConfigModule],
  controllers: [DirectController],
  providers: [DirectService],
  exports: [DirectService],
})
export class TimeDirectModule {}

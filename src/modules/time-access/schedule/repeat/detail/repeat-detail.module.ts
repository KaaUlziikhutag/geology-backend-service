import { Module } from '@nestjs/common';
import { RepeatDetailService } from './repeat-detail.service';
import { RepeatDetailController } from './repeat-detail.contoller';
import RepeatDetails from './entities/repeat-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([RepeatDetails]), ConfigModule],
  controllers: [RepeatDetailController],
  providers: [RepeatDetailService],
  exports: [RepeatDetailService],
})
export class RepeatDetailModule {}

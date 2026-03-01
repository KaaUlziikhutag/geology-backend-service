import { Module } from '@nestjs/common';
import { CelebratoryService } from './celebratory.service';
import { CelebratoryController } from './celebratory.contoller';
import Celebratorys from './celebratory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Celebratorys]), ConfigModule],
  controllers: [CelebratoryController],
  providers: [CelebratoryService],
  exports: [CelebratoryService],
})
export class TimeCelebratoryModule {}

import { Module } from '@nestjs/common';
import { AwardService } from './awards.service';
import { AwardController } from './awards.contoller';
import Awards from './awards.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Awards]), ConfigModule],
  controllers: [AwardController],
  providers: [AwardService],
  exports: [AwardService],
})
export class AwardModule {}

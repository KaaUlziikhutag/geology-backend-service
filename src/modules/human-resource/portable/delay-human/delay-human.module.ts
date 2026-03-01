import { Module } from '@nestjs/common';
import { DelayHumanService } from './delay-human.service';
import { DelayHumanController } from './delay-human.contoller';
import DelayHumans from './delay-human.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([DelayHumans]), ConfigModule],
  controllers: [DelayHumanController],
  providers: [DelayHumanService],
  exports: [DelayHumanService],
})
export class DelayHumanModule {}

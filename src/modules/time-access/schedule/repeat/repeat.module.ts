import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import Repeats from './entities/repeat.entity';
import { RepeatDetailModule } from './detail/repeat-detail.module';
import { RepeatController } from './repeat.contoller';
import { RepeatService } from './repeat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repeats]),
    ConfigModule,
    RepeatDetailModule,
  ],
  controllers: [RepeatController],
  providers: [RepeatService],
  exports: [RepeatService],
})
export class TimeRepeatModule {}

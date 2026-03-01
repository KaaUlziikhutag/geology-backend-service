import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.contoller';
import Levels from './level.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Levels]), ConfigModule],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}

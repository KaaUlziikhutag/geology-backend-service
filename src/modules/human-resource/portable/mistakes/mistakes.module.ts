import { Module } from '@nestjs/common';
import { MistakesService } from './mistakes.service';
import { MistakesController } from './mistakes.contoller';
import Mistakess from './mistakes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Mistakess]), ConfigModule],
  controllers: [MistakesController],
  providers: [MistakesService],
  exports: [MistakesService],
})
export class MistakesModule {}

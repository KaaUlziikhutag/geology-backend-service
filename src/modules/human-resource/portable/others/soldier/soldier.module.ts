import { Module } from '@nestjs/common';
import { SoldiersService } from './soldier.service';
import { SoldiersController } from './soldier.contoller';
import Soldierss from './soldier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Soldierss]), ConfigModule],
  controllers: [SoldiersController],
  providers: [SoldiersService],
  exports: [SoldiersService],
})
export class SoldiersModule {}

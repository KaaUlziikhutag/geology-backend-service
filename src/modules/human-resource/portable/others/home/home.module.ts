import { Module } from '@nestjs/common';
import { HomesService } from './home.service';
import { HomesController } from './home.contoller';
import Homess from './home.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Homess]), ConfigModule],
  controllers: [HomesController],
  providers: [HomesService],
  exports: [HomesService],
})
export class HomesModule {}

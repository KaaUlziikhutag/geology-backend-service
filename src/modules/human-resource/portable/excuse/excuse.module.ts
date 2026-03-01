import { Module } from '@nestjs/common';
import { ExcuseService } from './excuse.service';
import { ExcuseController } from './excuse.contoller';
import Excuses from './excuse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Excuses]), ConfigModule],
  controllers: [ExcuseController],
  providers: [ExcuseService],
  exports: [ExcuseService],
})
export class ExcuseModule {}

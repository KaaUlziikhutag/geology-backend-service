import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.contoller';
import Programs from './program.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Programs]), ConfigModule],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}

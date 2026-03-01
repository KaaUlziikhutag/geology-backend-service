import { Module } from '@nestjs/common';
import { AgreeByuserService } from './agree-byuser.service';
import { AgreeByuserController } from './agree-byuser.contoller';
import AgreeByusers from './agree-byuser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AgreeByusers]), ConfigModule],
  controllers: [AgreeByuserController],
  providers: [AgreeByuserService],
  exports: [AgreeByuserService],
})
export class TimeAgreeByuserModule {}

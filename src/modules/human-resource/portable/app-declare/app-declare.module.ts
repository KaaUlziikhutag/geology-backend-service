import { Module } from '@nestjs/common';
import { AppDeclareService } from './app-declare.service';
import { AppDeclareController } from './app-declare.contoller';
import AppDeclares from './app-declare.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AppDeclares]), ConfigModule],
  controllers: [AppDeclareController],
  providers: [AppDeclareService],
  exports: [AppDeclareService],
})
export class AppDeclareModule {}

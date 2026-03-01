import { Module } from '@nestjs/common';
import { EthicService } from './ethics.service';
import { EthicController } from './ethics.contoller';
import Ethics from './ethics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Ethics]), ConfigModule],
  controllers: [EthicController],
  providers: [EthicService],
  exports: [EthicService],
})
export class EthicModule {}

import { Module } from '@nestjs/common';
import { ExchangeHumanService } from './exchange-human.service';
import { ExchangeHumanController } from './exchange-human.contoller';
import ExchangeHumans from './exchange-human.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeHumans]), ConfigModule],
  controllers: [ExchangeHumanController],
  providers: [ExchangeHumanService],
  exports: [ExchangeHumanService],
})
export class ExchangeHumanModule {}

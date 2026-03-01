import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.contoller';
import Options from './option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Options]), ConfigModule],
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule {}

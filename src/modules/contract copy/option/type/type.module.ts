import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.contoller';
import Type from './type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Type]), ConfigModule],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService],
})
export class ContractTypeModule {}

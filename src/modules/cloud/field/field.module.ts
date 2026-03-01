import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.contoller';
import Fields from './field.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Fields]), ConfigModule],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService],
})
export class FieldModule {}

import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.contoller';
import Descriptions from './description.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Descriptions]), ConfigModule],
  controllers: [DescriptionController],
  providers: [DescriptionService],
  exports: [DescriptionService],
})
export class DescriptionModule {}

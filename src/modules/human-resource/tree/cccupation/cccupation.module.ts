import { Module } from '@nestjs/common';
import { OccupationService } from './cccupation.service';
import { OccupationController } from './cccupation.contoller';
import occupations from './cccupation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([occupations]), ConfigModule],
  controllers: [OccupationController],
  providers: [OccupationService],
  exports: [OccupationService],
})
export class OccupationModule {}

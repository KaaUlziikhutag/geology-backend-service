import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.contoller';
import Familys from './family.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Familys]), ConfigModule],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}

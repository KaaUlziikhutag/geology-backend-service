import { Module } from '@nestjs/common';
import { DecisionLegalActService } from './legal-act.service';
import { DecisionLegalActController } from './legal-act.contoller';
import LegalAct from './legal-act.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([LegalAct]), ConfigModule],
  controllers: [DecisionLegalActController],
  providers: [DecisionLegalActService],
  exports: [DecisionLegalActService],
})
export class DesicionLegalActModule {}

import { Module } from '@nestjs/common';
import { DelegateOurService } from './delegate-our.service';
import ContractDelegateOur from './delegate-our.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ContractDelegateOur]), ConfigModule],
  providers: [DelegateOurService],
  exports: [DelegateOurService],
})
export class DelegateOurModule {}

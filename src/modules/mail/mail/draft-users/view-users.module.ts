import { Module } from '@nestjs/common';
import { ViewUserService } from './view-users.service';
import SignatureViewUser from './view-users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([SignatureViewUser]), ConfigModule],
  providers: [ViewUserService],
  exports: [ViewUserService],
})
export class ContractModule {}

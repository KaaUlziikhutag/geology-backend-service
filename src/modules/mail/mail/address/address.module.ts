import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import SignatureViewUser from '../draft-users/view-users.entity';
import { ViewUserService } from '../draft-users/view-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([SignatureViewUser]), ConfigModule],
  providers: [ViewUserService],
  exports: [ViewUserService],
})
export class ContractModule {}

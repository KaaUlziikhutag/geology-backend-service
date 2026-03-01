import { Module } from '@nestjs/common';
import { ConnectionUserService } from './connection-users.service';
import ServerConnectionUser from './connection-users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ServerConnectionUser]), ConfigModule],
  providers: [ConnectionUserService],
  exports: [ConnectionUserService],
})
export class ContractModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ContractViewUser from './view-users.entity';
import { ViewUserService } from './view-users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ContractViewUser]), ConfigModule],
  providers: [ViewUserService],
  exports: [ViewUserService],
})
export class ViewUsersModule {}

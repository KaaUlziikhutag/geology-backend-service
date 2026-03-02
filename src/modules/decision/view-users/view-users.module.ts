import { Module } from '@nestjs/common';
import { DecisionViewUserService } from './view-users.service';
import DecisionViewUser from './view-users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([DecisionViewUser]), ConfigModule],
  providers: [DecisionViewUserService],
  exports: [DecisionViewUserService],
})
export class DecisionUserModule {}

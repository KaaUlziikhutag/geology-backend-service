import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import Users from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), ConfigModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

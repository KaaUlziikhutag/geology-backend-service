import { Module } from '@nestjs/common';
import { OthersService } from './others.service';
import { OthersController } from './others.contoller';
import Otherss from './others.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Otherss]), ConfigModule],
  controllers: [OthersController],
  providers: [OthersService],
  exports: [OthersService],
})
export class OthersModule {}

import { Module } from '@nestjs/common';
import { ItechItemService } from './itech-items.service';
import { ItechItemController } from './itech-items.contoller';
import ItechItems from './itech-items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ItechItems]), ConfigModule],
  controllers: [ItechItemController],
  providers: [ItechItemService],
  exports: [ItechItemService],
})
export class ItechItemModule {}

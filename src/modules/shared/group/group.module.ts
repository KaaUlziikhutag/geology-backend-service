import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.contoller';
import Groups from './group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Groups]), ConfigModule],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}

import { Module } from '@nestjs/common';
import { DelayGroupService } from './delay-group.service';
import { DelayGroupController } from './delay-group.contoller';
import DelayGroups from './delay-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([DelayGroups]), ConfigModule],
  controllers: [DelayGroupController],
  providers: [DelayGroupService],
  exports: [DelayGroupService],
})
export class DelayGroupModule {}

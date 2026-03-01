import { Module } from '@nestjs/common';
import { ModuleService } from './modules.service';
import { ModuleController } from './modules.contoller';
import Modules from './modules.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Modules]), ConfigModule],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}

import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.contoller';
import Accesss from './access.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProgramModule } from '../../cloud/programs/program.module';
import { ModuleModule } from '../../cloud/module/modules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accesss]),
    ConfigModule,
    ProgramModule,
    ModuleModule,
  ],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}

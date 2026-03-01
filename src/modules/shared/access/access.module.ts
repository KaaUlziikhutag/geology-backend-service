import { Module } from '@nestjs/common';
import { SharedAccessController } from './access.contoller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProgramModule } from '../../cloud/programs/program.module';
import { ModuleModule } from '../../cloud/module/modules.module';
import UserLimit from './entities/user-limit.entity';
import { SharedAccessService } from './access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLimit]),
    ConfigModule,
    ProgramModule,
    ModuleModule,
  ],
  controllers: [SharedAccessController],
  providers: [SharedAccessService],
  exports: [SharedAccessService],
})
export class SharedAccessModule {}

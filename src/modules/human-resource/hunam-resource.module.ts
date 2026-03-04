import { Module } from '@nestjs/common';
import { HumanResourceService } from './hunam-resource.service';
import { HumanResourceController } from './hunam-resource.controller';
import { EmailModule } from '../shared/email/email.module';
import { FieldModule } from '../cloud/field/field.module';
import { ProgramModule } from '../cloud/programs/program.module';
import { ModuleModule } from '../cloud/module/modules.module';
import { ColumnService } from './column-setup/column.service';
import { CountryModule } from '../cloud/country/country.module';
import { UsersModule } from '@modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Human from './member/human/human.entity';
import Worker from './member/worker/worker.entity';
import { TreeModule } from './tree/tree.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Human, Worker]),
    UsersModule,
    EmailModule,
    FieldModule,
    ProgramModule,
    TreeModule,
    ModuleModule,
    CountryModule,
  ],
  controllers: [HumanResourceController],
  providers: [HumanResourceService, ColumnService],
  exports: [HumanResourceService],
})
export class HumanResourceModule {}

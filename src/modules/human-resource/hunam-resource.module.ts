import { Module } from '@nestjs/common';
import { HumanResourceService } from './hunam-resource.service';
import { HumanResourceController } from './hunam-resource.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../cloud/user/user.module';
import { EmailModule } from '../shared/email/email.module';
import { FieldModule } from '../cloud/field/field.module';
import { ProgramModule } from '../cloud/programs/program.module';
import { ModuleModule } from '../cloud/module/modules.module';
import { ColumnService } from './column-setup/column.service';
import { CountryModule } from '../cloud/country/country.module';
@Module({
  imports: [
    ConfigModule,
    UserModule,
    EmailModule,
    FieldModule,
    ProgramModule,
    ModuleModule,
    CountryModule,
  ],
  controllers: [HumanResourceController],
  providers: [HumanResourceService, ColumnService],
  exports: [HumanResourceService],
})
export class HumanResourceModule {}

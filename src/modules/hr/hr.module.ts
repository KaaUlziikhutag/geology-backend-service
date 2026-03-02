import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
// import { DecisionModule } from '../decision/decision.module';
import { ContractModule } from '../contract/contract.module';
import { TaskModule } from '../task/task.module';
import { NotificationModule } from '../notification/notification.module';
import { TreeModule } from '@modules/human-resource/tree/tree.module';
import { InsuranceTypeModule } from '@modules/human-resource/tree/insurance-type/insurance-type.module';
import { WorkerModule } from '@modules/human-resource/member/worker/worker.module';
import { HumanModule } from '@modules/human-resource/member/human/human.module';
import { OccupationModule } from '@modules/human-resource/tree/cccupation/cccupation.module';
import { PublicNewsModule } from '@modules/public/news/news.module';
import { AccessModule } from '@modules/human-resource/access/access.module';

@Module({
  imports: [
    TreeModule,
    InsuranceTypeModule,
    WorkerModule,
    HumanModule,
    OccupationModule,
    PublicNewsModule,
    AccessModule,
    UsersModule,
    ContractModule,
    TaskModule,
    NotificationModule,
  ],
})
export class HrModule {}

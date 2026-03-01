import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { DecisionModule } from '../decision/decision.module';
import { ContractModule } from '../contract/contract.module';
import { TaskModule } from '../task/task.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UsersModule, DecisionModule, ContractModule, TaskModule, NotificationModule],
})
export class HrModule {}

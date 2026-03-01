import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import State from './entities/state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([State]), ConfigModule],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}

import { Module } from '@nestjs/common';
import { AboveService } from './above.service';
import { AboveController } from './above.contoller';
import Above from './above.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Above]), ConfigModule],
  controllers: [AboveController],
  providers: [AboveService],
  exports: [AboveService],
})
export class DecisionAboveModule {}

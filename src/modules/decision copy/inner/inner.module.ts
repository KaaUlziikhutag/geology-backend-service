import { Module } from '@nestjs/common';
import { InnerService } from './inner.service';
import { InnerController } from './inner.contoller';
import Inner from './inner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Inner]), ConfigModule],
  controllers: [InnerController],
  providers: [InnerService],
  exports: [InnerService],
})
export class DecisionInnerModule {}

import { Module } from '@nestjs/common';
import { HumanService } from './human.service';
import { HumanController } from './human.contoller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import Human from './human.entity';
import { CountryModule } from '../../../cloud/country/country.module';

@Module({
  imports: [TypeOrmModule.forFeature([Human]), ConfigModule, CountryModule],
  controllers: [HumanController],
  providers: [HumanService],
})
export class HumanModule {}

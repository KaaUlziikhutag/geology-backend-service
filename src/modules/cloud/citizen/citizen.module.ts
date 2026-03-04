import { Module } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { CitizenController } from './citizen.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizen } from './entities/citizen.entity';
import { CitizenRelationship } from './entities/relationships.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Citizen, CitizenRelationship]),
  ],
  controllers: [CitizenController],
  providers: [CitizenService],
})
export class CitizenModule {}

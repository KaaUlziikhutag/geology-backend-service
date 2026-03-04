import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Region from './entities/region.entity';
import { RegionController } from './region.controller';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Region])],
  controllers: [RegionController],
  providers: [RegionsService],
  exports: [RegionsService],
})
export class RegionsModule {}

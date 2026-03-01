import { Module } from '@nestjs/common';
import { LanguageService } from './languages.service';
import { LanguageController } from './languages.contoller';
import Languages from './languages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Languages]), ConfigModule],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}

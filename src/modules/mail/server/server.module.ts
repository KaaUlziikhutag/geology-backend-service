import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.contoller';
import Server from './server.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Server]), ConfigModule],
  controllers: [ServerController],
  providers: [ServerService],
  exports: [ServerService],
})
export class ServerModule {}

import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.contoller';
import AccesssTime from './entities/access-time.entity';
import AccessTerminal from './entities/access-terminal.enitity';
import AccessTempTimes from './entities/access-temp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../cloud/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccesssTime, AccessTerminal, AccessTempTimes]),
    ConfigModule,
    UserModule,
  ],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class TimeAccessModule {}

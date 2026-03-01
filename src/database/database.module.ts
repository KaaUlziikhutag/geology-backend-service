import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseLogger from './database.logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        logger: new DatabaseLogger(),
        host: configService.get<string>('POSTGRES_HOST'),
        port: Number(configService.get<number>('POSTGRES_PORT')),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: ['./dist/**/*.entity'],
        autoLoadEntities: true,
        migrationsTableName: 'migration',
        migrations:
          configService.get('MODE') !== 'DEV'
            ? ['./dist/database/migration/*']
            : ['./src/database/migration/*.ts'],
        cli: {
          migrationsDir: 'src/database/migration',
        },
        synchronize: configService.get('MODE') === 'DEV',
      }),
    }),
  ],
})
export class DatabaseModule {}

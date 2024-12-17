import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseLogger from './database.logger.js';
import Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        POSTGRES_AUTH_HOST: Joi.string().required(),
        POSTGRES_AUTH_PORT: Joi.string().required(),
        POSTGRES_AUTH_USER: Joi.string().required(),
        POSTGRES_AUTH_PASSWORD: Joi.string().required(),
        POSTGRES_AUTH_DB: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        logger: new DatabaseLogger(),
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: ['./dist/**/*.entity.js'],
        autoLoadEntities: true,
        migrationsTableName: 'migration',
        migrations:
          configService.get('MODE') != 'DEV'
            ? ['./dist/database/migration/*']
            : ['./src/database/migration/*.ts'],

        cli: {
          migrationsDir: 'src/database/migration',
        },
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'userdb',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        logger: new DatabaseLogger(),
        host: configService.get('POSTGRES_AUTH_HOST'),
        port: configService.get('POSTGRES_AUTH_PORT'),
        username: configService.get('POSTGRES_AUTH_USER'),
        password: configService.get('POSTGRES_AUTH_PASSWORD'),
        database: configService.get('POSTGRES_AUTH_DB'),
        entities: ['./dist/modules/users/users.entity.js'],
        autoLoadEntities: true,
        migrationsTableName: 'migration',
        migrations:
          configService.get('MODE') != 'DEV'
            ? ['./dist/database/migration/*']
            : ['./src/database/migration/*.ts'],

        cli: {
          migrationsDir: 'src/database/migration',
        },
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

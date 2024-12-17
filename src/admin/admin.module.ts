import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import options from './options.js';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../modules/authentication/authentication.module.js';
import { AuthenticationService } from '../modules/authentication/authentication.service.js';

AdminJS.registerAdapter({ Resource, Database });

@Module({
  imports: [
    AdminModule.createAdminAsync({
      imports: [AuthenticationModule],
      inject: [AuthenticationService],
      useFactory: async (authenticationService: AuthenticationService) => ({
        adminJsOptions: options,
        auth: {
          authenticate: async (email: string, password: string) => {
            try {
              const data =
                await authenticationService.getAdminModuleAuthenticatedUser(
                  email,
                  password,
                );
              if (data.user) {
                const DEFAULT_ADMIN = {
                  userId: data.user.id,
                  email: data.user.email,
                  password: data.user.password,
                  role: data.user.role,
                  theme: 'dark',
                  token: data.accessToken,
                };
                return Promise.resolve(DEFAULT_ADMIN);
              }
              return null;
            } catch (error) {
              console.log('error =======>', error);
              return null;
            }
          },
          cookiePassword: 'secret',
          cookieName: 'adminjs',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret-geology',
        },
      }),
    }),
  ],
})
export class AdminBroModule {}

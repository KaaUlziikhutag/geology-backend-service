import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthToken } from './dto/auth-token.dto.js';
import { AuthRequestDto } from './dto/auth-request.dto.js';
import { catchError, firstValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EbarimtAuthService {
  private readonly logger = new Logger(EbarimtAuthService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async auth(): Promise<AuthToken> {
    const authRequest: AuthRequestDto = {
      client_id: 'vatps',
      grant_type: 'password',
      username: this.configService.get('EBARIMT_USERNAME'),
      password: this.configService.get('EBARIMT_PASSWORD'),
    };
    const payload = new URLSearchParams();
    for (const key in authRequest) {
      payload.append(key, authRequest[key]);
    }
    const response = await firstValueFrom(
      this.httpService
        .post(this.configService.get('EBARIMT_AUTH_URL'), payload)
        .pipe(
          catchError((error: any) => {
            this.logger.error(error);
            throw new Error(error);
          }),
        ),
    );
    return plainToClass(AuthToken, response.data);
  }
}

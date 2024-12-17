import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private readonly configService: ConfigService) {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      async (apiKey: string, done: any) => {
        return this.validate(apiKey, done);
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public validate = (apiKey: string, done: (error: Error, data: any) => {}) => {
    if (this.configService.get<string>('API_KEY') === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  };
}

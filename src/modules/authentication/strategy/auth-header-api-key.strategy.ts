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
    super({ header: 'X-API-KEY', prefix: '' }, false);
  }

  validate(apiKey: string, done: (error: any, data: any) => void) {
    const validKey = this.configService.get<string>('API_KEY');
    if (apiKey === validKey) {
      return done(null, true);
    }
    return done(new UnauthorizedException('Invalid API key'), null);
  }
}

import { IsString } from 'class-validator';

export class AuthRequestDto {
  @IsString()
  client_id: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  grant_type: string;
}

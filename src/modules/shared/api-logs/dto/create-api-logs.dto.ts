import { IsString, IsNumber } from 'class-validator';

export class CreateApiLog {
  @IsString()
  system_name: string;

  @IsString()
  request_type: string;

  @IsString()
  ref_number: string;

  @IsString()
  pnr_number: string;

  @IsNumber()
  status_code: number;

  @IsString()
  error_msg: string;

  @IsString()
  request_payload: string;

  @IsString()
  responce_payload: string;
}

export default CreateApiLog;

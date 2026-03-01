import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { ConsumerDto } from './dto/consumer.dto';
import { ApproveQrDto } from './dto/approve-qr.dto';
import { ProfileDto } from './dto/profile.dto';
import { CreateApprovaQrDto } from './dto/create-approve-qr.dto';
import { EbarimtAuthService } from '../ebarimt-auth/ebarimt-auth.service';

@Injectable()
export class EbarimtEasyService {
  private readonly logger = new Logger(EbarimtEasyService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly ebarimtAuthService: EbarimtAuthService,
  ) {}
  private async getToken(): Promise<string> {
    const { accessToken } = await this.ebarimtAuthService.auth();
    return accessToken;
  }
  /**
   * @param regno Харилцагчийн регистр
   * @returns {ConsumerDto}
   */
  async consumerByRegno(regno: string): Promise<ConsumerDto> {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService
        .get<ConsumerDto>('api/info/consumer/' + regno, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
  /**
   * @param phoneNum Харилцагчийн утасны дугаар
   * @returns {ProfileDto}
   */
  async profileByPhone(phoneNum: string): Promise<ProfileDto> {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService
        .post<ProfileDto>(
          'rest/v1/getProfile',
          { phoneNum },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error ======>', error);
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async approveQr({
    customerNo,
    qrData,
  }: CreateApprovaQrDto): Promise<ApproveQrDto> {
    const token = await this.getToken();
    const { data } = await firstValueFrom(
      this.httpService
        .post<ApproveQrDto>(
          'rest/v1/getProfile',
          { customerNo, qrData },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { OrgInfoDto } from './dto/org-info.dto';

@Injectable()
export class EbarimtInfoService {
  private readonly logger = new Logger(EbarimtInfoService.name);
  constructor(private readonly httpService: HttpService) {}

  async orgInfo(regno: string): Promise<OrgInfoDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<OrgInfoDto>('/merchant/info', { params: { regno } })
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

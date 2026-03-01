import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { TinInfoDto } from './dto/tin-info.dto';
import { InfoDto } from './dto/info.dto';
import { BranchInfoDto } from './dto/branch-info.dto';

@Injectable()
export class EbarimtInquireService {
  private readonly logger = new Logger(EbarimtInquireService.name);
  constructor(private readonly httpService: HttpService) {}

  /** Татвар төлөгчийн дугаар лавлах /ТIN, Civil_id/ */
  async getTinInfo(regNo: string): Promise<TinInfoDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<TinInfoDto>('/api/info/check/getTinInfo', { params: { regNo } })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
  /** Татвар төлөгчийн бүртгэлийн мэдээлэл лавлах сервис */
  async getInfo(tin: string): Promise<InfoDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<InfoDto>('/api/info/check/getInfo', { params: { tin } })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
  /** Татварын алба, дэд албаны жагсаалт */
  async getBranchInfo(regNo: string): Promise<BranchInfoDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<BranchInfoDto>('/api/info/check/getTinInfo', { params: { regNo } })
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

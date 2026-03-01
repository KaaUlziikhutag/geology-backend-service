import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ApiLogService } from '../../api-log/api-log.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import CreateApiLogDto from '../../api-log/dto/create-api-log.dto';
import { CreateReceiptRes } from './response/create-receipt.response';
import { DeleteReceiptDto } from './dto/delete-receipt.dto';
import { PosApiInfo } from './response/pos-api-info.response';
import { BankAccount } from './response/bank-account.response';

@Injectable()
export class EbarimtService {
  private readonly logger = new Logger(EbarimtService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly apiLogService: ApiLogService,
  ) {}

  async createReceipt(req: CreateReceiptDto): Promise<CreateReceiptRes> {
    const apiLog: CreateApiLogDto = {
      systemName: EbarimtService.name,
      requestType: 'post',
      statusCode: 0,
      errorMsg: '',
      userId: 0,
      requestPayload: '',
      responcePayload: '',
    };
    const { data, status } = await firstValueFrom(
      this.httpService.post<CreateReceiptRes>('/rest/receipt', req).pipe(
        catchError((error) => {
          apiLog.errorMsg = JSON.stringify(error.response.data);
          apiLog.statusCode = error.response.status;
          this.apiLogService.createApiLog(apiLog);
          this.logger.error(error.response.data);
          throw new Error(error?.response?.data?.message);
        }),
      ),
    );
    apiLog.statusCode = status;
    apiLog.requestPayload = JSON.stringify(req);
    apiLog.responcePayload = JSON.stringify(data);
    this.apiLogService.createApiLog(apiLog);
    return data;
  }

  async deleteReceipt(req: DeleteReceiptDto): Promise<void> {
    const apiLog: CreateApiLogDto = {
      systemName: EbarimtService.name,
      requestType: 'delete',
      statusCode: 0,
      errorMsg: '',
      userId: 0,
      requestPayload: JSON.stringify(req),
      responcePayload: '',
    };
    const { data } = await firstValueFrom(
      this.httpService.delete('/rest/receipt', { data: req }).pipe(
        catchError((error) => {
          this.logger.error(error.response.data);
          apiLog.statusCode = error.response.status;
          apiLog.errorMsg = JSON.stringify(error.response.data);
          this.apiLogService.createApiLog(apiLog);
          throw 'An error happened!';
        }),
      ),
    );
    apiLog.responcePayload = JSON.stringify(data);
  }

  async send(): Promise<void> {
    await firstValueFrom(
      this.httpService.get<void>('/rest/sendData').pipe(
        catchError((error) => {
          this.logger.error(error.response?.data);
          throw new Error('An error happened while sending data!');
        }),
      ),
    );
  }
  async info(): Promise<PosApiInfo> {
    const { data } = await firstValueFrom(
      this.httpService.get<PosApiInfo>('/rest/info').pipe(
        catchError((error) => {
          this.logger.error(error.response?.data);
          throw new Error('An error happened while retrieving POS info!');
        }),
      ),
    );
    return data;
  }
  async bankAccounts(tin: string): Promise<BankAccount[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<BankAccount[]>('/rest/bankAccounts', { params: { tin } })
        .pipe(
          catchError((error) => {
            this.logger.error(error.response?.data);
            throw new Error(
              'An error happened while retrieving bank accounts!',
            );
          }),
        ),
    );
    return data;
  }
}

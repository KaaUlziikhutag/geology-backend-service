import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EbarimtService } from './ebarimt.service.js';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '../../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../../utils/dto/response.dto.js';
import { ApiTags } from '@nestjs/swagger';

@Controller('ebarimt')
@ApiTags('ebarimt')
export class EbarimtController {
  constructor(private readonly ebarimtService: EbarimtService) {}

  @Get('information')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getInformation(): Promise<IResponse> {
    try {
      const data = await this.ebarimtService.info();
      return new ResponseSuccess('EBARIMT_INFORMATION.SUCCESS', data);
    } catch (error) {
      new BadRequestException(error.toString());
    }
  }

  @Get('send')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async send(): Promise<IResponse> {
    try {
      const data = await this.ebarimtService.send();
      return new ResponseSuccess('EBARIMT_SEND_DATA.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('bank-accounts/:tin')
  @UseGuards(AuthGuard('api-key'))
  async bankAccounts(@Param('tin') tin: string): Promise<IResponse> {
    try {
      const data = await this.ebarimtService.bankAccounts(tin);
      return new ResponseSuccess('EBARIMT_ACCOUNT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BarcodeService } from './barcode.service';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import { AuthGuard } from '@nestjs/passport';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';

@Controller('barcode')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('barocde')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Get('counter')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCountBarcode(): Promise<IResponse> {
    try {
      const data = await this.barcodeService.getCountBarcode();
      return new ResponseSuccess('COUNT_BARCODE', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async generateBarcode(): Promise<IResponse> {
    try {
      const data = await this.barcodeService.generateBarcode();
      return new ResponseSuccess('GENERATE', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

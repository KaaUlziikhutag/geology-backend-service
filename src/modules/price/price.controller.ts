import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PriceService } from './price.service.js';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import { ApiTags } from '@nestjs/swagger';
import GetPriceDto from './dto/get-price.dto.js';
import FindOneParams from '../../utils/find-one-params.js';

@Controller('price')
@ApiTags('price')
@UseInterceptors(ClassSerializerInterceptor)
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getPrice(@Query() query: GetPriceDto): Promise<IResponse> {
    try {
      const data = await this.priceService.getPrice(query);
      return new ResponseSuccess('GET_PRICE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getPriceById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.priceService.getPriceById(id);
      return new ResponseSuccess('GET_PRICE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

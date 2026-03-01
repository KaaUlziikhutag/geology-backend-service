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
import { PriceService } from './price.service';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '../../utils/interfaces/response.interface';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import GetPriceDto from './dto/get-price.dto';
import FindOneParams from '../../utils/find-one-params';

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

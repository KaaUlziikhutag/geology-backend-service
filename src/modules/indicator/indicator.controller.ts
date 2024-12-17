import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IndicatorService } from './indicator.service.js';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import { GetIndicatorDto } from './dto/get-indicator.dto.js';

@Controller('indicator')
@ApiTags('indicator')
@UseInterceptors(ClassSerializerInterceptor)
export class IndicatorController {
  constructor(private readonly indicatorService: IndicatorService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllIndicator(@Query() query: GetIndicatorDto): Promise<IResponse> {
    try {
      const data = await this.indicatorService.getAllIndicator(query);
      return new ResponseSuccess('GET_INDICATOR', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

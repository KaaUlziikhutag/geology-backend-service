import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DecisionService } from './decision.service.js';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';

@Controller('decision')
@ApiTags('decision')
@UseInterceptors(ClassSerializerInterceptor)
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAll(): Promise<IResponse> {
    try {
      const data = await this.decisionService.getAll();
      return new ResponseSuccess('GET_DECISION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

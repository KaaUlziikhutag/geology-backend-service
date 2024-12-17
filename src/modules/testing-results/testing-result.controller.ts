import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestingResultService } from './testing-result.service.js';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../authentication/interface/request-with-user.interface.js';
import { CreateTestingResultDto } from './dto/create-testing-result.dto.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import FindOneParams from '../../utils/find-one-params.js';

@Controller('testing-result')
@ApiTags('testing-result')
@UseInterceptors(ClassSerializerInterceptor)
export class TestingResultController {
  constructor(private readonly resultService: TestingResultService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createTask(
    @Req() { user }: RequestWithUser,
    @Body() result: CreateTestingResultDto,
  ): Promise<IResponse> {
    try {
      const data = await this.resultService.createTestingResult(user, result);
      return new ResponseSuccess('CREATE_RESULT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getTestingResultById(
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.resultService.getTestingResultById(id);
      return new ResponseSuccess('GET_RESULT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

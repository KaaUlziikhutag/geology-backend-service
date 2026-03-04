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
import { TestingResultService } from './testing-result.service';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';
import { CreateTestingResultDto } from './dto/create-testing-result.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import FindOneParams from '../../utils/find-one-params';

@Controller('testing-result')
@ApiTags('testing-result')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
@UseGuards(AuthGuard('api-key'))
export class TestingResultController {
  constructor(private readonly resultService: TestingResultService) {}

  @Post()
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

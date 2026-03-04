import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { TimeStateService } from './time-state.service';
import { CreateTimeStateDto } from './dto/create-time-state.dto';
import { UpdateTimeStateDto } from './dto/update-time-state.dto';
import { GetTimeStateDto } from './dto/get-time-state.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '@utils/dto/response.dto';
import { IResponse } from '@utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('time-time-state')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
@UseGuards(AuthGuard('api-key'))
export class TimeStateController {
  constructor(private readonly timeStateService: TimeStateService) {}

  @Get()
  async getAllTimeState(@Query() query: GetTimeStateDto): Promise<IResponse> {
    try {
      const data = await this.timeStateService.getAll(query);
      return new ResponseSuccess('GET_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  async getOptionById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.timeStateService.getById(id);
      return new ResponseSuccess('GET_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOption(@Body() dto: CreateTimeStateDto): Promise<IResponse> {
    try {
      const data = await this.timeStateService.create(dto);
      return new ResponseSuccess('CREATE_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  async updateOption(
    @Param() { id }: FindOneParams,
    @Body() dto: UpdateTimeStateDto,
  ): Promise<IResponse> {
    try {
      const data = await this.timeStateService.updateById(id, dto);
      return new ResponseSuccess('UPDATE_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async deleteOption(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.timeStateService.deleteTimeState(id);
      return new ResponseSuccess('DELETE_TIME_STATE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

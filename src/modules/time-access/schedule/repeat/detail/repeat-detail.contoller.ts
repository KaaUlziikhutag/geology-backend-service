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
  Req,
} from '@nestjs/common';
import { RepeatDetailService } from './repeat-detail.service';
import { CreateRepeatDetailDto } from './dto/create-repeat-detail.dto';
import { UpdateRepeatDetailDto } from './dto/update-repeat-detail.dto';
import { GetRepeatDetailDto } from './dto/get-repeat-detail.dto';
import FindOneParams from '../../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../../utils/dto/response.dto';
import { IResponse } from '../../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../../authentication/interface/request-with-user.interface';

@Controller('time-repeatdetail')
@UseInterceptors(ClassSerializerInterceptor)
export class RepeatDetailController {
  constructor(private readonly repeatDetailService: RepeatDetailService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllRepeatDetail(
    @Req() request: RequestWithUser,
    @Query() query: GetRepeatDetailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatDetailService.getAllRepeatDetail(
        query,
        user,
      );
      return new ResponseSuccess('GET_REPEAT_DETAILS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getRepeatDetailById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatDetailService.getRepeatDetailById(id, user);
      return new ResponseSuccess('GET_REPEAT_DETAILS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createRepeatDetail(
    @Req() request: RequestWithUser,
    @Body() repeatDetail: CreateRepeatDetailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatDetailService.createRepeatDetail(
        repeatDetail,
        user,
      );
      return new ResponseSuccess('CREATE_REPEAT_DETAILS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateRepeatDetail(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() repeatDetail: UpdateRepeatDetailDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatDetailService.updateRepeatDetail(
        id,
        user,
        repeatDetail,
      );
      return new ResponseSuccess('UPDATE_REPEAT_DETAILS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteRepeatDetail(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.repeatDetailService.deleteRepeatDetail(id, user);
      return new ResponseSuccess('DELETE_REPEAT_DETAILS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

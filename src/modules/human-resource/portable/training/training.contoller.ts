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
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { GetTrainingDto } from './dto/get-training.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-training')
@UseInterceptors(ClassSerializerInterceptor)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllTrainings(
    @Req() request: RequestWithUser,
    @Query() query: GetTrainingDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.trainingService.getAllTrainings(query, user);
      return new ResponseSuccess('GET_TRAININGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getTrainingById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.trainingService.getTrainingById(id, user);
      return new ResponseSuccess('GET_TRAININGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createTraining(
    @Req() request: RequestWithUser,
    @Body() training: CreateTrainingDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.trainingService.createTraining(training, user);
      return new ResponseSuccess('CREATE_TRAININGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateTraining(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() training: UpdateTrainingDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.trainingService.updateTraining(
        id,
        user,
        training,
      );
      return new ResponseSuccess('UPDATE_TRAININGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteTraining(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.trainingService.deleteTraining(id, user);
      return new ResponseSuccess('DELETE_TRAININGS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

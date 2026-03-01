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
import { InnerTrainingService } from './inner-training.service';
import { CreateInnerTrainingDto } from './dto/create-inner-training.dto';
import { UpdateInnerTrainingDto } from './dto/update-inner-training.dto';
import { GetInnerTrainingDto } from './dto/get-inner-training.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-inner-training')
@UseInterceptors(ClassSerializerInterceptor)
export class InnerTrainingController {
  constructor(private readonly innerTrainingService: InnerTrainingService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllInnerTrainings(
    @Req() request: RequestWithUser,
    @Query() query: GetInnerTrainingDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerTrainingService.getAllInnerTrainings(
        query,
        user,
      );
      return new ResponseSuccess('GET_InnerTrainingS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getInnerTrainingById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerTrainingService.getInnerTrainingById(
        id,
        user,
      );
      return new ResponseSuccess('GET_InnerTrainingS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createInnerTraining(
    @Req() request: RequestWithUser,
    @Body() innerTraining: CreateInnerTrainingDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerTrainingService.createInnerTraining(
        innerTraining,
        user,
      );
      return new ResponseSuccess('CREATE_InnerTrainingS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateInnerTraining(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() innerTraining: UpdateInnerTrainingDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerTrainingService.updateInnerTraining(
        id,
        user,
        innerTraining,
      );
      return new ResponseSuccess('UPDATE_InnerTrainingS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteInnerTraining(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.innerTrainingService.deleteInnerTraining(
        id,
        user,
      );
      return new ResponseSuccess('DELETE_InnerTrainingS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

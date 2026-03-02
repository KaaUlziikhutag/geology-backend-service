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
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { GetWorkerDto } from './dto/get-worker.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';
import { UpdateWorkerAuthorDto } from './dto/update-author.dto';

@Controller('worker')
@UseInterceptors(ClassSerializerInterceptor)
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllWorkers(
    @Req() request: RequestWithUser,
    @Query() query: GetWorkerDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.workerService.getAllWorkers(query, user);
      return new ResponseSuccess('GET_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getWorkerById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.workerService.getWorkerById(id, user);
      return new ResponseSuccess('GET_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createWorker(
    @Req() request: RequestWithUser,
    @Body() worker: CreateWorkerDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.workerService.createWorker(user, worker);
      return new ResponseSuccess('CREATE_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateWorker(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() worker: UpdateWorkerDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.workerService.updateWorker(id, user, worker);
      return new ResponseSuccess('UPDATE_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Хариуцагч шилжүүлэх
  @Patch('type/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateWorkerType(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() worker: UpdateWorkerAuthorDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const idArray = ids.split(',').map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        return parsedId;
      });
      const data = await this.workerService.updateWorkerType(
        idArray,
        user,
        worker,
      );
      return new ResponseSuccess('UPDATE_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteWorker(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.workerService.deleteWorker(id, user);
      return new ResponseSuccess('DELETE_WORKER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

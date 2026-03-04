import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import FindOneParams from '../../utils/find-one-params';
import { CreateTaskDto } from './dto/create-task.dto';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';
import { GetTaskDto } from './dto/get-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import { GetAnalyticTaskDto } from './dto/get-analytic-task.dto';
import { TaskUsersDto } from './dto/task-users.dto';

@Controller('task')
@ApiTags('task')
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createTask(
    @Req() { user }: RequestWithUser,
    @Body() task: CreateTaskDto,
  ): Promise<IResponse> {
    try {
      const data = await this.taskService.createTask(user, task);
      return new ResponseSuccess('CREATE_TASK', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get('analytic')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAnalyticTasks(
    @Query() query: GetAnalyticTaskDto,
  ): Promise<IResponse> {
    try {
      const data = await this.taskService.getAnalyticTasks(query);
      return new ResponseSuccess('GET_TASK', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getTasks(@Query() query: GetTaskDto): Promise<IResponse> {
    try {
      const data = await this.taskService.getTasks(query);
      return new ResponseSuccess('GET_TASKS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateTask(
    @Req() { user }: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Body() task: UpdateTaskDto,
  ): Promise<IResponse> {
    try {
      const data = await this.taskService.updateTask(user, id, task);
      return new ResponseSuccess('UPDATE_TASK', data);
    } catch (error) {
      console.log('error =======>', error);
      throw new BadRequestException(error.toString());
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteTask(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      await this.taskService.deleteTask(id);
      return new ResponseSuccess('DELETE_TASK');
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async scheduleTask(@Body() taskUser: TaskUsersDto): Promise<IResponse> {
    try {
      await this.taskService.scheduleTask(taskUser);
      return new ResponseSuccess('SCHEDULE_TASK');
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

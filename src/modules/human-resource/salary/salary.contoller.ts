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
import { SalaryService } from './salary.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { GetSalaryDto } from './dto/get-salary.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('human-resource-salary')
@UseInterceptors(ClassSerializerInterceptor)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSalarys(
    @Req() request: RequestWithUser,
    @Query() query: GetSalaryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.salaryService.getAllSalarys(query, user);
      return new ResponseSuccess('GET_SALARY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getSalaryById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.salaryService.getSalaryById(id, user);
      return new ResponseSuccess('GET_SALARY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createSalary(
    @Req() request: RequestWithUser,
    @Body() salary: CreateSalaryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.salaryService.createSalary(salary, user);
      return new ResponseSuccess('CREATE_SALARY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSalary(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() salary: UpdateSalaryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.salaryService.updateSalary(id, user, salary);
      return new ResponseSuccess('UPDATE_SALARY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteSalary(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.salaryService.deleteSalary(id, user);
      return new ResponseSuccess('DELETE_SALARY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

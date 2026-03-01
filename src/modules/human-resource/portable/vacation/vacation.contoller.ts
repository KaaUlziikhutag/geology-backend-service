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
import { VacationService } from './vacation.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { GetVacationDto } from './dto/get-vacation.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/vacation')
@UseInterceptors(ClassSerializerInterceptor)
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllVacations(
    @Req() request: RequestWithUser,
    @Query() query: GetVacationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.vacationService.getAllVacations(query, user);
      return new ResponseSuccess('GET_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getVacationById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.vacationService.getVacationById(id, user);
      return new ResponseSuccess('GET_VACATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createVacation(
    @Req() request: RequestWithUser,
    @Body() vacation: CreateVacationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.vacationService.createVacation(vacation, user);
      return new ResponseSuccess('CREATE_SOCIALS.SUCCESS', data);
    } catch (error) {
      console.log('+++++++++++++>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateVacation(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() vacation: UpdateVacationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.vacationService.updateVacation(
        id,
        user,
        vacation,
      );
      return new ResponseSuccess('UPDATE_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteVacation(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.vacationService.deleteVacation(id, user);
      return new ResponseSuccess('DELETE_SOCIALS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

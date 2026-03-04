import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
  Req,
} from '@nestjs/common';
import { OccupationService } from './cccupation.service';
import { CreateoccupationDto } from './dto/create-cccupation.dto';
import { UpdateoccupationDto } from './dto/update-cccupation.dto';
import { GetOccupationDto } from './dto/get-cccupation.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('cloud/occupation')
@UseInterceptors(ClassSerializerInterceptor)
export class OccupationController {
  constructor(private readonly occupationService: OccupationService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllOccupations(
    @Query() query: GetOccupationDto,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.occupationService.getAllOccupations(query, user);
      return new ResponseSuccess('GET_OCCUPATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getoccupationById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.occupationService.getoccupationById(id, user);
      return new ResponseSuccess('GET_OCCUPATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createoccupation(
    @Req() request: RequestWithUser,
    @Body() occupation: CreateoccupationDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.occupationService.createoccupation(
        occupation,
        user,
      );
      return new ResponseSuccess('CREATE_OCCUPATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateoccupation(
    @Param() { id }: FindOneParams,
    @Body() occupation: UpdateoccupationDto,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.occupationService.updateoccupation(
        id,
        occupation,
        user,
      );
      return new ResponseSuccess('UPDATE_OCCUPATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteoccupation(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.occupationService.deleteoccupation(id, user);
      return new ResponseSuccess('DELETE_OCCUPATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

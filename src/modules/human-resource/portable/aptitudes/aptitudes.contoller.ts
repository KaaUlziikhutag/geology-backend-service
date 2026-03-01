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
import { AptitudeService } from './aptitudes.service';
import { CreateAptitudeDto } from './dto/create-aptitudes.dto';
import { UpdateAptitudeDto } from './dto/update-aptitudes.dto';
import { GetAptitudeDto } from './dto/get-aptitudess.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource/aptitude')
@UseInterceptors(ClassSerializerInterceptor)
export class AptitudeController {
  constructor(private readonly aptitudeService: AptitudeService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAptitudes(
    @Req() request: RequestWithUser,
    @Query() query: GetAptitudeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aptitudeService.getAllAptitudes(query, user);
      return new ResponseSuccess('GET_APTITUDE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAptitudeById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aptitudeService.getAptitudeById(id, user);
      return new ResponseSuccess('GET_APTITUDE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAptitude(
    @Req() request: RequestWithUser,
    @Body() aptitude: CreateAptitudeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aptitudeService.createAptitude(aptitude, user);
      return new ResponseSuccess('CREATE_APTITUDE.SUCCESS', data);
    } catch (error) {
      console.log('=======================.>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAptitude(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() aptitude: UpdateAptitudeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aptitudeService.updateAptitude(
        id,
        user,
        aptitude,
      );
      return new ResponseSuccess('UPDATE_APTITUDE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAptitude(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aptitudeService.deleteAptitude(id, user);
      return new ResponseSuccess('DELETE_APTITUDE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

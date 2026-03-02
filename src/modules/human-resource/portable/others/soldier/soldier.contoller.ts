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
import { SoldiersService } from './soldier.service';
import { CreateSoldiersDto } from './dto/create-soldier.dto';
import { UpdateSoldiersDto } from './dto/update-soldier.dto';
import { GetSoldiersDto } from './dto/get-soldier.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../../utils/dto/response.dto';
import { IResponse } from '../../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-soldiers')
@UseInterceptors(ClassSerializerInterceptor)
export class SoldiersController {
  constructor(private readonly soldiersService: SoldiersService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSoldierss(
    @Req() request: RequestWithUser,
    @Query() query: GetSoldiersDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.soldiersService.getAllSoldierss(query, user);
      return new ResponseSuccess('GET_Soldiers.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getSoldiersById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.soldiersService.getSoldiersById(id, user);
      return new ResponseSuccess('GET_Soldiers.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createSoldiers(
    @Req() request: RequestWithUser,
    @Body() soldiers: CreateSoldiersDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.soldiersService.createSoldiers(soldiers, user);
      return new ResponseSuccess('CREATE_Soldiers.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSoldiers(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() soldiers: UpdateSoldiersDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.soldiersService.updateSoldiers(
        id,
        user,
        soldiers,
      );
      return new ResponseSuccess('UPDATE_Soldiers.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteSoldiers(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.soldiersService.deleteSoldiers(id, user);
      return new ResponseSuccess('DELETE_Soldiers.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

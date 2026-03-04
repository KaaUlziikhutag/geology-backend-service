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
import { HomesService } from './home.service';
import { CreateHomesDto } from './dto/create-home.dto';
import { UpdateHomesDto } from './dto/update-home.dto';
import { GetHomesDto } from './dto/get-home.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../../utils/dto/response.dto';
import { IResponse } from '../../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource-homes')
@UseInterceptors(ClassSerializerInterceptor)
export class HomesController {
  constructor(private readonly homesService: HomesService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllHomess(
    @Req() request: RequestWithUser,
    @Query() query: GetHomesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.homesService.getAllHomess(query, user);
      return new ResponseSuccess('GET_Homes.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getHomesById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.homesService.getHomesById(id, user);
      return new ResponseSuccess('GET_Homes.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createHomes(
    @Req() request: RequestWithUser,
    @Body() Homes: CreateHomesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.homesService.createHomes(Homes, user);
      return new ResponseSuccess('CREATE_Homes.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateHomes(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() Homes: UpdateHomesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.homesService.updateHomes(id, user, Homes);
      return new ResponseSuccess('UPDATE_Homes.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteHomes(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.homesService.deleteHomes(id, user);
      return new ResponseSuccess('DELETE_Homes.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

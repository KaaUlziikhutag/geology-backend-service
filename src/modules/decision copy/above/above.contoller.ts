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
import { AboveService } from './above.service';
import { CreateAbovetDto } from './dto/create-above.dto';
import { UpdateAboveDto } from './dto/update-above.dto';
import { GetAboveDto } from './dto/get-above.dto';
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('decision-above')
@UseInterceptors(ClassSerializerInterceptor)
export class AboveController {
  constructor(private readonly aboveService: AboveService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAbove(
    @Req() request: RequestWithUser,
    @Query() query: GetAboveDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aboveService.getAllAboves(query, user);
      return new ResponseSuccess('GET_DECISION_ABOVES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAboveById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aboveService.getAboveById(id, user);
      return new ResponseSuccess('GET_DECISION_ABOVE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAccess(
    @Req() request: RequestWithUser,
    @Body() above: CreateAbovetDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aboveService.createAbove(above, user);
      return new ResponseSuccess('CREATE_DECISION_ABOVE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccess(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() above: UpdateAboveDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aboveService.updateAbove(id, user, above);
      return new ResponseSuccess('UPDATE_DECISION_ABOVE.SUCCESS', data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.aboveService.deleteAbove(id, user);
      return new ResponseSuccess('DELETE_DECISION_ABOVE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

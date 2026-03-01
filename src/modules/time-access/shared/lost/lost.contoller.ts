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
import { DirectLostService } from './lost.service';
import { CreateDirectLostDto } from './dto/create-lost.dto';
import { UpdateDirectLostDto } from './dto/update-lost.dto';
import { GetDirectLostDto } from './dto/get-lost.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('settings/directLost')
@UseInterceptors(ClassSerializerInterceptor)
export class DirectLostController {
  constructor(private readonly directLostService: DirectLostService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDirectLosts(
    @Req() request: RequestWithUser,
    @Query() query: GetDirectLostDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directLostService.getAllDirectLosts(query, user);
      return new ResponseSuccess('GET_DIRECT_lOST.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDirectLostById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directLostService.getDirectLostById(id, user);
      return new ResponseSuccess('GET_DIRECT_lOST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDirectLost(
    @Req() request: RequestWithUser,
    @Body() directLost: CreateDirectLostDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directLostService.createDirectLost(
        directLost,
        user,
      );
      return new ResponseSuccess('CREATE_DIRECT_lOST.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDirectLost(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() directLost: UpdateDirectLostDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directLostService.updateDirectLost(
        id,
        user,
        directLost,
      );
      return new ResponseSuccess('UPDATE_DIRECT_lOST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDirectLost(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.directLostService.deleteDirectLost(id, user);
      return new ResponseSuccess('DELETE_DIRECT_lOST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

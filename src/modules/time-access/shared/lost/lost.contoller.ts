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
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '@utils/dto/response.dto';
import { IResponse } from '@utils/interfaces/response.interface';
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
    @Query() query: GetDirectLostDto,
  ): Promise<IResponse> {
    try {
      const data = await this.directLostService.getAllDirectLosts(query);
      return new ResponseSuccess('GET_DIRECT_lOST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDirectLostById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.directLostService.getDirectLostById(id);
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
    @Body() directLost: CreateDirectLostDto,
  ): Promise<IResponse> {
    try {
      const data = await this.directLostService.createDirectLost(directLost);
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
    @Body() directLost: UpdateDirectLostDto,
  ): Promise<IResponse> {
    try {
      const data = await this.directLostService.updateDirectLost(
        id,
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
  async deleteDirectLost(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.directLostService.deleteDirectLost(id);
      return new ResponseSuccess('DELETE_DIRECT_lOST.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Req,
  Query,
} from '@nestjs/common';
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';
import { GetAccessDto } from './dto/get-access.dto';

@Controller('time-access')
@UseInterceptors(ClassSerializerInterceptor)
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAccess(@Query() query: GetAccessDto): Promise<IResponse> {
    try {
      const data = await this.accessService.getAllAccess(query);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get('all')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllWorkers(@Query() query: GetAccessDto): Promise<IResponse> {
    try {
      const data = await this.accessService.getAllWorkers(query);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAccessById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.accessService.getAccessById(id);
      return new ResponseSuccess('GET_ACCESS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // @Post('')
  // @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  // @UseGuards(AuthGuard('api-key'))
  // async createAccess(
  //   @Req() request: RequestWithUser,
  //   @Body() access: CreateAccessDto,
  // ): Promise<IResponse> {
  //   try {
  //     const { user } = request;
  //     const data = await this.accessService.createAccess(access, user);
  //     return new ResponseSuccess('CREATE_ACCESS.SUCCESS', data);
  //   } catch (error) {
  //     console.log('------------------>', error);
  //     throw new BadRequestException(error);
  //   }
  // }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccess(@Body() access: CreateAccessDto): Promise<IResponse> {
    try {
      await this.accessService.createAccess(access);
      return new ResponseSuccess('CREATE_ACCESS.SUCCESS');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

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
import { DisabledService } from './disabled.service';
import { CreateDisabledDto } from './dto/create-disabled.dto';
import { UpdateDisabledDto } from './dto/update-disabled.dto';
import { GetDisabledDto } from './dto/get-disabled.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../../utils/dto/response.dto';
import { IResponse } from '../../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-disabled')
@UseInterceptors(ClassSerializerInterceptor)
export class DisabledController {
  constructor(private readonly disabledService: DisabledService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDisableds(
    @Req() request: RequestWithUser,
    @Query() query: GetDisabledDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.disabledService.getAllDisableds(query, user);
      return new ResponseSuccess('GET_Disabled.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDisabledById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.disabledService.getDisabledById(id, user);
      return new ResponseSuccess('GET_Disabled.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createDisabled(
    @Req() request: RequestWithUser,
    @Body() disabled: CreateDisabledDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.disabledService.createDisabled(disabled, user);
      return new ResponseSuccess('CREATE_Disabled.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateDisabled(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() disabled: UpdateDisabledDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.disabledService.updateDisabled(
        id,
        user,
        disabled,
      );
      return new ResponseSuccess('UPDATE_Disabled.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteDisabled(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.disabledService.deleteDisabled(id, user);
      return new ResponseSuccess('DELETE_Disabled.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

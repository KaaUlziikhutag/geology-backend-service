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
import { MistakesService } from './mistakes.service';
import { CreateMistakesDto } from './dto/create-mistakes.dto';
import { UpdateMistakesDto } from './dto/update-mistakes.dto';
import { GetMistakesDto } from './dto/get-mistakes.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('human-resource-mistake')
@UseInterceptors(ClassSerializerInterceptor)
export class MistakesController {
  constructor(private readonly mistakesService: MistakesService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllMistakes(
    @Req() request: RequestWithUser,
    @Query() query: GetMistakesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      console.log('=========>orlooo1');
      const data = await this.mistakesService.getAllMistakes(query, user);
      return new ResponseSuccess('GET_MISTAKES.SUCCESS', data);
    } catch (error) {
      console.log('=========>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getMistakesById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mistakesService.getMistakesById(id, user);
      return new ResponseSuccess('GET_MISTAKES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createMistakes(
    @Req() request: RequestWithUser,
    @Body() mistakes: CreateMistakesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mistakesService.createMistakes(mistakes, user);
      return new ResponseSuccess('CREATE_MISTAKES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateMistakes(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() mistakes: UpdateMistakesDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mistakesService.updateMistakes(
        id,
        user,
        mistakes,
      );
      return new ResponseSuccess('UPDATE_MISTAKES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteMistakes(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.mistakesService.deleteMistakes(id, user);
      return new ResponseSuccess('DELETE_MISTAKES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

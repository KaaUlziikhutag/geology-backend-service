import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MineralService } from './mineral.service';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import GetMineralDto from './dto/get-mineral.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import FindOneParams from '../../../utils/find-one-params';
import CreateMineralDto from './dto/create-mineral.dto';
import UpdateMineralDto from './dto/update-mineral.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('mineral')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('mineral')
export class MineralController {
  constructor(private readonly mineralService: MineralService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllMineral(@Query() query: GetMineralDto): Promise<IResponse> {
    try {
      const data = await this.mineralService.getAllMineral(query);
      return new ResponseSuccess('GET_MINERAL', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getMineralById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.mineralService.getMineralById(id);
      return new ResponseSuccess('GET_MINERAL', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createMineral(@Body() mineral: CreateMineralDto): Promise<IResponse> {
    try {
      const data = await this.mineralService.createMineral(mineral);
      return new ResponseSuccess('CREATE_MINERAL.SUCCESS', data);
    } catch (error) {
      console.log('error =======>', error);
      throw new BadRequestException(error);
    }
  }
  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateMineral(
    @Param() { id }: FindOneParams,
    @Body() mineral: UpdateMineralDto,
  ): Promise<IResponse> {
    try {
      const data = await this.mineralService.updateMineral(id, mineral);
      return new ResponseSuccess('UPDATE_MINERAL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteMineral(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.mineralService.deleteMineral(id);
      return new ResponseSuccess('DELETE_MINERAL.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

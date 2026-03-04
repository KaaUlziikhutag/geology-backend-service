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
  BadRequestException,
} from '@nestjs/common';
import { GraphicService } from './graphic.service';
import { CreateGraphicDto } from './dto/create-graphic.dto';
import { UpdateGraphicDto } from './dto/update-graphic.dto';
import { GetGraphicDto } from './dto/get-graphic.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '@utils/dto/response.dto';
import { IResponse } from '@utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('time-access-repeat-graphic')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
@UseGuards(AuthGuard('api-key'))
export class GraphicController {
  constructor(private readonly graphicService: GraphicService) {}

  @Get()
  async getAllGraphic(@Query() query: GetGraphicDto): Promise<IResponse> {
    try {
      const data = await this.graphicService.getAllGraphic(query);
      return new ResponseSuccess('GET_GRAPHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  async getGraphicById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.graphicService.getGraphicId(id);
      return new ResponseSuccess('GET_GRAPHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @UseGuards(AuthGuard('api-key'))
  async createGraphic(@Body() graphic: CreateGraphicDto): Promise<IResponse> {
    try {
      const data = await this.graphicService.createGraphic(graphic);
      return new ResponseSuccess('CREATE_GRAPHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  async updateGraphic(
    @Param() { id }: FindOneParams,
    @Body() graphic: UpdateGraphicDto,
  ): Promise<IResponse> {
    try {
      const data = await this.graphicService.updateGraphic(id, graphic);
      return new ResponseSuccess('UPDATE_GRAPHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async deleteGraphic(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.graphicService.deleteGraphic(id);
      return new ResponseSuccess('DELETE_GRAPHIC.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

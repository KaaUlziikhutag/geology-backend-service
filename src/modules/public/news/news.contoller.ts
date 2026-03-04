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
import { PublicNewsService } from './news.service';
import { CreatePublicNewsDto } from './dto/create-news.dto';
import { UpdatePublicNewsDto } from './dto/update-news.dto';
import { GetPublicNewsDto } from './dto/get-news.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';
import { CreateUserViewDto } from './dto/create-user-view.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('public-news')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicNewsController {
  constructor(private readonly publicNewsService: PublicNewsService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllNews(@Query() query: GetPublicNewsDto): Promise<IResponse> {
    try {
      const data = await this.publicNewsService.getAllNews(query);
      return new ResponseSuccess('GET_NEWS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getNewsById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicNewsService.getNewsById(id);
      return new ResponseSuccess('GET_NEWS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createNews(
    @Req() request: RequestWithUser,
    @Body() news: CreatePublicNewsDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicNewsService.createNews(news, user);
      return new ResponseSuccess('CREATE_NEWS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('user-view')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async addUserView(@Body() userViews: CreateUserViewDto): Promise<IResponse> {
    try {
      const data = await this.publicNewsService.addUserView(userViews);
      return new ResponseSuccess('CREATE_NEWS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('comment')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async addComment(
    @Req() request: RequestWithUser,
    @Body() userViews: CreateCommentDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicNewsService.addComment(userViews, user);
      return new ResponseSuccess('CREATE_NEWS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateNews(
    @Param() { id }: FindOneParams,
    @Body() news: UpdatePublicNewsDto,
  ): Promise<IResponse> {
    try {
      const data = await this.publicNewsService.updateNews(id, news);
      return new ResponseSuccess('UPDATE_NEWS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteNews(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicNewsService.deleteNews(id);
      return new ResponseSuccess('DELETE_NEWS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete('comment/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteComment(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicNewsService.deleteComment(id);
      return new ResponseSuccess('DELETE_COMMENT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

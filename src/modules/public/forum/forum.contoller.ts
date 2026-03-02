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
import { PublicForumService } from './forum.service';
import { CreatePublicForumDto } from './dto/create-forum.dto';
import { UpdatePublicForumDto } from './dto/update-forum.dto';
import { GetPublicForumDto } from './dto/get-forum.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('public-forum')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicForumController {
  constructor(private readonly publicForumService: PublicForumService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSignature(@Query() query: GetPublicForumDto): Promise<IResponse> {
    try {
      const data = await this.publicForumService.getAllForum(query);
      return new ResponseSuccess('GET_FORUMS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getGalleryById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicForumService.getForumById(id);
      return new ResponseSuccess('GET_FORUM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createFile(
    @Req() request: RequestWithUser,
    @Body() forum: CreatePublicForumDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicForumService.createForum(forum, user);
      return new ResponseSuccess('CREATE_FORUM.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateGallery(
    @Param() { id }: FindOneParams,
    @Body() forum: UpdatePublicForumDto,
  ): Promise<IResponse> {
    try {
      const data = await this.publicForumService.updateForum(id, forum);
      return new ResponseSuccess('UPDATE_FORUM.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteGallery(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicForumService.deleteForum(id);
      return new ResponseSuccess('DELETE_FORUM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
  Req,
} from '@nestjs/common';
import { TreeService } from './tree.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { GetTreeDto } from './dto/get-tree.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('cloud/tree')
@UseInterceptors(ClassSerializerInterceptor)
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllTrees(
    @Req() request: RequestWithUser,
    @Query() query: GetTreeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.treeService.getAllTrees(query, user);
      return new ResponseSuccess('GET_TREE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getTreeById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.treeService.getTreeById(id);
      return new ResponseSuccess('GET_TREE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createTree(
    @Req() request: RequestWithUser,
    @Body() tree: CreateTreeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.treeService.createTree(tree, user);
      return new ResponseSuccess('CREATE_TREE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateTree(
    @Param() { id }: FindOneParams,
    @Body() tree: UpdateTreeDto,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.treeService.updateTree(id, tree, user);
      return new ResponseSuccess('UPDATE_TREE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteTree(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.treeService.deleteTree(id, user);
      return new ResponseSuccess('DELETE_TREE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

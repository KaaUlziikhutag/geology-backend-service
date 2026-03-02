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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

@Controller('contract-category')
@UseInterceptors(ClassSerializerInterceptor)
export class ContractController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllCategory(@Query() query: GetCategoryDto): Promise<IResponse> {
    try {
      const data = await this.categoryService.getAllCategories(query);
      return new ResponseSuccess('GET_CATEGORIES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCategoryById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.categoryService.getCategoryById(id);
      return new ResponseSuccess('GET_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createCategory(
    @Req() request: RequestWithUser,
    @Body() category: CreateCategoryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.categoryService.createCategory(category, user);
      return new ResponseSuccess('CREATE_CATEGORY.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccess(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() category: UpdateCategoryDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.categoryService.updateCategory(
        id,
        user,
        category,
      );
      return new ResponseSuccess('UPDATE_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.categoryService.deleteCategory(id);
      return new ResponseSuccess('DELETE_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

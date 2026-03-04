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
import CategoryService from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '@utils/interfaces/response.interface';
import { ResponseSuccess } from '@utils/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import GetCategoryDto from './dto/get-category.dto';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-category.dto';
import { IdsDto } from '@utils/dto/ids.dto';
import { ReorderCategoryDto } from './dto/reorder-category.dto';
import FindOneParams from '@utils/find-one-params';

@Controller('category')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Ангилал')
@UseGuards(AuthGuard('api-key'))
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(@Query() query: GetCategoryDto): Promise<IResponse> {
    try {
      const data = await this.categoryService.getAll(query);
      return new ResponseSuccess('GET_ALL_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get('list')
  async getByIds(@Query() query: IdsDto): Promise<IResponse> {
    try {
      const data = await this.categoryService.getByIds(query.ids);
      return new ResponseSuccess('GET_ALL_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<IResponse> {
    try {
      const data = await this.categoryService.create(dto);
      return new ResponseSuccess('CREATE_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() dto: UpdateCategoryDto,
  ): Promise<IResponse> {
    try {
      const data = await this.categoryService.update(id, dto);
      return new ResponseSuccess('UPDATE_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Delete(':id')
  async remove(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.categoryService.remove(id);
      return new ResponseSuccess('DELETE_CATEGORY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Post('reorder')
  async reorder(@Body() items: ReorderCategoryDto[]) {
    const data = this.categoryService.reorder(items);
    return new ResponseSuccess('REORDER_CATEGORY.SUCCESS', data);
  }
}

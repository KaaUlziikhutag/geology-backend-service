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
import ProductService from './product.service';
import { AuthGuard } from '@nestjs/passport';
import GetProductDto from './dto/get-product.dto';
import { IResponse } from '@utils/interfaces/response.interface';
import { ResponseSuccess } from '@utils/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';

@Controller('product')
@ApiTags('Бүтээгдэхүүн')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('api-key'))
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query() query: GetProductDto): Promise<IResponse> {
    const data = await this.productService.getAll(query);
    return new ResponseSuccess('GET_ALL_PRODUCT.SUCCESS', data);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<IResponse> {
    const data = await this.productService.getById(id);
    return new ResponseSuccess('GET_PRODUCT.SUCCESS', data);
  }

  @Post()
  @UseGuards(AuthGuard('api-key'))
  async create(@Body() dto: CreateProductDto): Promise<IResponse> {
    const data = await this.productService.create(dto);
    return new ResponseSuccess('CREATE_PRODUCT.SUCCESS', data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<IResponse> {
    try {
      const data = await this.productService.update(id, dto);
      return new ResponseSuccess('UPDATE_PRODUCT.SUCCESS', data);
    } catch (error) {
      console.log('error ======>', error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('api-key'))
  async remove(@Param('id') id: number): Promise<IResponse> {
    const data = await this.productService.remove(id);
    return new ResponseSuccess('DELETE_PRODUCT.SUCCESS', data);
  }
}

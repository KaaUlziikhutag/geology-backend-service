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
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service.js';
import { AuthGuard } from '@nestjs/passport';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import CreateProductDto from './dto/create-product.dto.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import FindOneParams from '../../utils/find-one-params.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ApiPaginatedResponse } from '../../utils/api-paginated-response.decorator.js';
import PageProductDto from './dto/page-product.dto.js';
import GetProductDto from './dto/get-product.dto.js';

@Controller('product')
@ApiTags('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createProduct(@Body() product: CreateProductDto): Promise<IResponse> {
    try {
      const data = await this.productService.createProduct(product);
      return new ResponseSuccess('CREATE_PRODUCT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getProductById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.productService.getProductById(id);
      return new ResponseSuccess('GET_PRODUCT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateProduct(
    @Param() { id }: FindOneParams,
    @Body() product: UpdateProductDto,
  ): Promise<IResponse> {
    try {
      const data = await this.productService.updateProduct(id, product);
      return new ResponseSuccess('UPDATE_PRODUCT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteProduct(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.productService.deleteProduct(id);
      return new ResponseSuccess('DELETE_PRODUCT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  @ApiPaginatedResponse(PageProductDto)
  async getProducts(@Query() query: GetProductDto): Promise<IResponse> {
    try {
      const data = await this.productService.getProducts(query);
      return new ResponseSuccess('GET_PRODUCT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}

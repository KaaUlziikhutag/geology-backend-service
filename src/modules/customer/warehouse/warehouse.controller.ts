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
import { WarehouseService } from './warehouse.service.js';
import { AuthGuard } from '@nestjs/passport';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard.js';
import CreateWarehouseDto from './dto/create-warehouse.dto.js';
import { IResponse } from '../../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../../utils/dto/response.dto.js';
import FindOneParams from '../../../utils/find-one-params.js';
import GetWarehouseDto from './dto/get-warehouse.dto.js';
import UpdateWarehouseDto from './dto/update-warehouse.dto.js';
import { ApiTags } from '@nestjs/swagger';

@Controller('warehouse')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createWarehouse(
    @Body() warehouse: CreateWarehouseDto,
  ): Promise<IResponse> {
    try {
      const data = await this.warehouseService.createWarehouse(warehouse);
      return new ResponseSuccess('CREATE_WAREHOUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllWarehouse(@Query() query: GetWarehouseDto): Promise<IResponse> {
    try {
      const data = await this.warehouseService.getAllWarehouse(query);
      return new ResponseSuccess('GET_WAREHOUSE', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getWarehouseById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.warehouseService.getWarehouseById(id);
      return new ResponseSuccess('GET_WAREHOUSE', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateWarehouse(
    @Param() { id }: FindOneParams,
    @Body() warehouse: UpdateWarehouseDto,
  ): Promise<IResponse> {
    try {
      const data = await this.warehouseService.updateWarehouse(id, warehouse);
      return new ResponseSuccess('UPDATE_WAREHOUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteWarehouse(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.warehouseService.deleteWarehouse(id);
      return new ResponseSuccess('DELETE_WAREHOUSE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

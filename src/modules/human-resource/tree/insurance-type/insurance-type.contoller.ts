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
import { InsuranceTypeService } from './insurance-type.service';
import { CreateInsuranceTypeDto } from './dto/create-insurance-type.dto';
import { UpdateInsuranceTypeDto } from './dto/update-insurance-type.dto';
import { GetInsuranceTypeDto } from './dto/get-insurance-type.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('cloud/insuranceType')
@UseGuards(JwtAuthenticationGuard)
@UseGuards(AuthGuard('api-key'))
@UseInterceptors(ClassSerializerInterceptor)
export class InsuranceTypeController {
  constructor(private readonly insuranceTypeService: InsuranceTypeService) {}

  @Get()
  async getAll(@Query() query: GetInsuranceTypeDto): Promise<IResponse> {
    try {
      const data = await this.insuranceTypeService.getAll(query);
      return new ResponseSuccess('GET_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.insuranceTypeService.getById(id);
      return new ResponseSuccess('GET_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInsuranceTypeDto): Promise<IResponse> {
    try {
      const data = await this.insuranceTypeService.create(dto);
      return new ResponseSuccess('CREATE_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  async updateById(
    @Param() { id }: FindOneParams,
    @Body() dto: UpdateInsuranceTypeDto,
  ): Promise<IResponse> {
    try {
      const data = await this.insuranceTypeService.updateById(id, dto);
      return new ResponseSuccess('UPDATE_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async deleteById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.insuranceTypeService.deleteById(id);
      return new ResponseSuccess('DELETE_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

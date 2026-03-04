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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GetCompanyDto } from './dto/get-company.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('organization/company')
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllCompanys(
    @Req() request: RequestWithUser,
    @Query() query: GetCompanyDto,
  ): Promise<IResponse> {
    try {
      const data = await this.companyService.getAllCompanys(query);
      return new ResponseSuccess('GET_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCompanyById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.companyService.getCompanyById(id);
      return new ResponseSuccess('GET_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createCompany(@Body() company: CreateCompanyDto): Promise<IResponse> {
    try {
      const data = await this.companyService.createCompany(company);
      return new ResponseSuccess('CREATE_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateCompany(
    @Param() { id }: FindOneParams,
    @Body() company: UpdateCompanyDto,
  ): Promise<IResponse> {
    try {
      const data = await this.companyService.updateCompany(id, company);
      return new ResponseSuccess('UPDATE_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteCompany(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.companyService.deleteCompany(id);
      return new ResponseSuccess('DELETE_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

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
import FindOneParams from '../../../utils/findOneParams';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../authentication/interface/request-with-user.interface';

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
      const { user } = request;
      const data = await this.companyService.getAllCompanys(query, user);
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
      const { user } = request;
      const data = await this.companyService.getCompanyById(id, user);
      return new ResponseSuccess('GET_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createCompany(
    @Req() request: RequestWithUser,
    @Body() company: CreateCompanyDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.companyService.createCompany(company, user);
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
    @Req() request: RequestWithUser,
    @Body() company: UpdateCompanyDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.companyService.updateCompany(id, user, company);
      return new ResponseSuccess('UPDATE_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteCompany(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.companyService.deleteCompany(id, user);
      return new ResponseSuccess('DELETE_COMPANY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

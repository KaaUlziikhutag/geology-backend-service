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
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompaniesDto } from './dto/create-companies.dto';
import { UpdateCompaniesDto } from './dto/update-companies.dto';
import { GetCompaniesDto } from './dto/get-companies.dto';
import FindOneParams from '../../../utils/findOneParams';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('cloud/companies')
@UseInterceptors(ClassSerializerInterceptor)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllCompaniess(@Query() query: GetCompaniesDto): Promise<IResponse> {
    try {
      const data = await this.companiesService.getAllCompaniess(query);
      return new ResponseSuccess('GET_COMPANIES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCompaniesById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.companiesService.getCompaniesById(id);
      return new ResponseSuccess('GET_COMPANIES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createCompanies(
    @Body() companies: CreateCompaniesDto,
  ): Promise<IResponse> {
    try {
      const data = await this.companiesService.createCompanies(companies);
      return new ResponseSuccess('CREATE_COMPANIES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateCompanies(
    @Param() { id }: FindOneParams,

    @Body() companies: UpdateCompaniesDto,
  ): Promise<IResponse> {
    try {
      const data = await this.companiesService.updateCompanies(
        id,

        companies,
      );
      return new ResponseSuccess('UPDATE_COMPANIES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteCompanies(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.companiesService.deleteCompanies(id);
      return new ResponseSuccess('DELETE_COMPANIES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
